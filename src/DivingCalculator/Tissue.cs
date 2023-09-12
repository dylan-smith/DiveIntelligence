namespace DivingCalculator
{
    public class Tissue
    {
        // TODO: gradient factors when calculating ceiling
        public int Number { get; init; }
        public double N2HalfLife { get; init; }
        public double A_N2 { get; init; }
        public double B_N2 { get; init; }
        public double HeHalfLife { get; init; }
        public double A_He { get; init; }
        public double B_He { get; init; }
        public double PN2 { get; private set; }
        public double PHe { get; private set; }
        private Dictionary<int, (double PN2, double PHe)> _tissueByTime = new();

        public Tissue(int number, double n2HalfLife, double a_n2, double b_n2, double heHalfLife, double a_he, double b_he, double pN2, double pHe, DiveProfile profile)
        {
            Number = number;
            N2HalfLife = n2HalfLife;
            A_N2 = a_n2;
            B_N2 = b_n2;
            HeHalfLife = heHalfLife;
            A_He = a_he;
            B_He = b_he;
            PN2 = pN2;
            PHe = pHe;

            ApplyDiveProfile(profile);
        }

        private void ApplyDiveProfile(DiveProfile profile)
        {
            _tissueByTime.Clear();
            _tissueByTime.Add(0, (PN2, PHe));

            for (var t = 1; t <= profile.TotalTime; t++)
            {
                var prevN2 = _tissueByTime[t - 1].PN2;
                var gasN2 = profile.ProfileByTime[t].gas.GetNitrogenPartialPressure(profile.ProfileByTime[t].depth);
                var n2Delta = GetPN2Delta(prevN2, gasN2);

                var prevHe = _tissueByTime[t - 1].PHe;
                var gasHe = profile.ProfileByTime[t].gas.GetHeliumPartialPressure(profile.ProfileByTime[t].depth);
                var heDelta = GetPHeDelta(prevHe, gasHe);

                _tissueByTime.Add(t, (prevN2 + n2Delta, prevHe + heDelta));
            }

            PN2 = _tissueByTime[profile.TotalTime].PN2;
            PHe = _tissueByTime[profile.TotalTime].PHe;
        }

        private double GetPN2Delta(double tissuePN2, double gasPN2) => GetTissueDelta(tissuePN2, gasPN2, N2HalfLife);
        private double GetPHeDelta(double tissuePHe, double gasPHe) => GetTissueDelta(tissuePHe, gasPHe, HeHalfLife);
        private double GetTissueDelta(double tissuePartialPressure, double gasPartialPressure, double halfLife) => (gasPartialPressure - tissuePartialPressure) * (1 - Math.Pow(2, -(1 / (halfLife * 60))));

        public double GetA(int time) => ((GetPN2(time) * A_N2) + (GetPHe(time) * A_He)) / GetPTotal(time);
        public double GetB(int time) => ((GetPN2(time) * B_N2) + (GetPHe(time) * B_He)) / GetPTotal(time);
        public double GetMValue(int time) => (GetPTotal(time) - GetA(time)) * GetB(time);
        public double GetCeiling(int time)
        {
            var result = (GetMValue(time) - 1) * 10;
            return result < 0 ? 0 : result;
        }

        public double GetPN2(int time) => _tissueByTime[time].PN2;
        public double GetPHe(int time) => _tissueByTime[time].PHe;
        public double GetPTotal(int time) => GetPN2(time) + GetPHe(time);
    }
}
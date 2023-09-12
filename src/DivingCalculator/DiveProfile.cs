namespace DivingCalculator
{
    public class DiveProfile
    {
        private readonly BreathingGas _startGas;
        private readonly List<(double Depth, int Time)> _depths = new();
        private readonly List<(BreathingGas Gas, int Time)> _gases = new();
        private readonly Dictionary<int, (double depth, BreathingGas gas)> _profileByTime = new();
        private bool _recalc = true;

        public Dictionary<int, (double depth, BreathingGas gas)> ProfileByTime
        {
            get
            {
                Recalc();
                return _profileByTime;
            }
        }

        public DiveProfile(BreathingGas gas)
        {
            _startGas = gas;
            _depths.Add((0, 0));
            _gases.Add((_startGas, 0));
        }

        public void SetDepth(double depth, int time)
        {
            _depths.Add((depth, time));
            _recalc = true;
        }

        public void SetGas(BreathingGas gas, int time)
        {
            _gases.Add((gas, time));
            _recalc = true;
        }

        public double MaximumDepth => _depths.Max(d => d.Depth);

        public double AverageDepth
        {
            get
            {
                return ProfileByTime.Average(x => x.Value.depth);
            }
        }

        public int TotalTime => _depths.Max(d => d.Time);

        public double GetPO2(int time) => GetGas(time).GetOxygenPartialPressure(ProfileByTime[time].depth);
        public double GetPN2(int time) => GetGas(time).GetNitrogenPartialPressure(ProfileByTime[time].depth);
        public double GetPHe(int time) => GetGas(time).GetHeliumPartialPressure(ProfileByTime[time].depth);

        public BreathingGas GetGas(int time) => _gases.Where(x => x.Time <= time).WithMax(x => x.Time).Gas;
        public double GetDepth(int time)
        {
            if (time <= 0) return 0;

            var beforeDepth = _depths.Where(x => x.Time < time).WithMax(x => x.Time);
            var afterDepth = _depths.Where(x => x.Time >= time).WithMin(x => x.Time);

            var depth = beforeDepth.Depth + ((afterDepth.Depth - beforeDepth.Depth) * (time - beforeDepth.Time) / (afterDepth.Time - beforeDepth.Time));

            return depth;
        }

        public double GetEAD(int time) => ((GetPN2(time) / 0.79) - 1) * 10;

        private void BreakdownByEachSecond()
        {
            _profileByTime.Clear();
            _profileByTime.Add(0, (0, _startGas));

            for (var t = 1; t <= _depths.Max(d => d.Time); t++)
            {
                _profileByTime.Add(t, (GetDepth(t), GetGas(t)));
            }
        }

        private void Recalc()
        {
            if (_recalc)
            {
                BreakdownByEachSecond();
                _recalc = false;
            }
        }
    }
}

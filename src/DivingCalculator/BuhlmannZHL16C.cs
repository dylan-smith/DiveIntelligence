namespace DivingCalculator
{
    // TODO: Gradient factors when calculating ceiling
    // TDOO: Helium
    public class BuhlmannZHL16C
    {
        private readonly DiveProfile _profile;
        public List<Tissue> Tissues { get; private set; } = new();
        private const double ENVIRONMENT_PN2 = 0.79;
        private const double ENVIRONMENT_HE = 0.0;

        public BuhlmannZHL16C(DiveProfile profile)
        {
            _profile = profile;

            Tissues.Add(new Tissue(1, 5, 1.1696, 0.5578, 1.51, 1.7474, 0.4245, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(2, 8, 1.0, 0.6514, 3.02, 1.3830, 0.5747, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(3, 12.5, 0.8618, 0.7222, 4.72, 1.1919, 0.6257, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(4, 18.5, 0.7562, 0.7825, 6.99, 1.0458, 0.7223, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(5, 27, 0.62, 0.8126, 10.21, 0.9220, 0.7582, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(6, 38.3, 0.5043, 0.8434, 14.48, 0.8205, 0.7957, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(7, 54.3, 0.4410, 0.8693, 20.53, 0.7305, 0.8279, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(8, 77, 0.4000, 0.8910, 29.11, 0.6502, 0.8553, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(9, 109, 0.3750, 0.9092, 41.2, 0.5950, 0.8757, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(10, 146, 0.3500, 0.9222, 55.19, 0.5545, 0.8903, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(11, 187, 0.3295, 0.9319, 70.69, 0.5333, 0.8997, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(12, 239, 0.3065, 0.9403, 90.34, 0.5189, 0.9073, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(13, 305, 0.2835, 0.9477, 115.29, 0.5181, 0.9122, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(14, 390, 0.2610, 0.9544, 147.42, 0.5176, 0.9171, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(15, 498, 0.2480, 0.9602, 188.24, 0.5172, 0.9217, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
            Tissues.Add(new Tissue(16, 635, 0.2327, 0.9653, 240.03, 0.5119, 0.9267, ENVIRONMENT_PN2, ENVIRONMENT_HE, profile));
        }

        public double Ceiling => GetCeiling(_profile.TotalTime);

        public double GetCeiling(int time) => Tissues.Max(t => t.GetCeiling(time));
    }
}

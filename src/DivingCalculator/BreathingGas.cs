namespace DivingCalculator
{
    public record BreathingGas(double Oxygen, double Nitrogen, double Helium)
    {
        public double GetNitrogenPartialPressure(double depth) => ((depth / 10.0) + 1) * Nitrogen;
        public double GetOxygenPartialPressure(double depth) => ((depth / 10.0) + 1) * Oxygen;
        public double GetHeliumPartialPressure(double depth) => ((depth / 10.0) + 1) * Helium;
    }
}

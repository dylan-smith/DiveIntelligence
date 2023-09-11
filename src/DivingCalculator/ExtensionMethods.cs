namespace DivingCalculator
{
    public static class CollectionExtensions
    {
        public static T WithMin<T>(this IEnumerable<T> a, Func<T, int> selector)
        {
            var min = a.Min(selector);
            return a.First(x => selector(x) == min);
        }

        public static T WithMin<T>(this IEnumerable<T> a, Func<T, long> selector)
        {
            var min = a.Min(selector);
            return a.First(x => selector(x) == min);
        }

        public static T WithMin<T>(this IEnumerable<T> a, Func<T, double> selector)
        {
            var min = a.Min(selector);
            return a.First(x => selector(x) == min);
        }

        public static T WithMax<T>(this IEnumerable<T> a, Func<T, int> selector)
        {
            var max = a.Max(selector);
            return a.First(x => selector(x) == max);
        }

        public static T WithMax<T>(this IEnumerable<T> a, Func<T, long> selector)
        {
            var max = a.Max(selector);
            return a.First(x => selector(x) == max);
        }

        public static T WithMax<T>(this IEnumerable<T> a, Func<T, double> selector)
        {
            var max = a.Max(selector);
            return a.First(x => selector(x) == max);
        }
    }
}
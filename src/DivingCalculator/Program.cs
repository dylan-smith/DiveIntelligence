using System.Data;
using System.Data.SqlClient;

namespace DivingCalculator
{
    internal class Program
    {
        // TODO: Nitrogen Narcosis
        // TODO: P02 graphs
        // TODO: Tooltip shows all tissues
        static void Main()
        {
            var air = new BreathingGas(0.21, 0.79, 0);
            var ean12 = new BreathingGas(0.12, 0.88, 0);
            var ean24 = new BreathingGas(0.24, 0.76, 0);
            var ean35 = new BreathingGas(0.35, 0.65, 0);
            var ean50 = new BreathingGas(0.50, 0.50, 0);
            var ean66 = new BreathingGas(0.66, 0.34, 0);
            var ean88 = new BreathingGas(0.88, 0.12, 0);
            var oxygen = new BreathingGas(1.0, 0, 0);

            var profile = new DiveProfile(air);

            // BENT
            //profile.SetDepth(100, 240);
            //profile.SetDepth(100, 3600);
            //profile.SetDepth(6, 3840);
            //profile.SetDepth(6, 4020);
            //profile.SetDepth(0, 4026);

            // DECO WITH AIR
            //profile.SetDepth(100, 240);
            //profile.SetDepth(100, 3600);
            //profile.SetDepth(50, 3840);
            //profile.SetDepth(50, 5040);
            //profile.SetDepth(34, 5100);
            //profile.SetDepth(34, 8700);
            //profile.SetDepth(23, 8760);
            //profile.SetDepth(23, 12360);
            //profile.SetDepth(17, 12420);
            //profile.SetDepth(17, 26820);
            //profile.SetDepth(10, 26880);
            //profile.SetDepth(10, 41280);
            //profile.SetDepth(6, 41340);
            //profile.SetDepth(6, 80000);
            //profile.SetDepth(2, 80060);
            //profile.SetDepth(2, 107000);
            //profile.SetDepth(0, 107010);

            // NO HELIUM, 8 HOURS DECO, REALLY NARC'D
            profile.SetDepth(50, 120);
            profile.SetGas(ean12, 120);

            profile.SetDepth(100, 240);
            profile.SetDepth(100, 3600);

            profile.SetDepth(55, 3660);
            profile.SetGas(ean24, 3660);
            profile.SetDepth(55, 7260);

            profile.SetDepth(35, 7320);
            profile.SetGas(ean35, 7320);
            profile.SetDepth(35, 10920);

            profile.SetDepth(22, 10980);
            profile.SetGas(ean50, 10980);
            profile.SetDepth(22, 14580);

            profile.SetDepth(14, 14640);
            profile.SetGas(ean66, 14640);
            profile.SetDepth(14, 18180);

            profile.SetDepth(9, 18240);
            profile.SetGas(ean88, 18240);
            profile.SetDepth(9, 21840);

            profile.SetDepth(6, 21900);
            profile.SetGas(oxygen, 21900);
            profile.SetDepth(6, 32700);
            profile.SetDepth(0, 32720);

            var algo = new BuhlmannZHL16C(profile);

            Console.WriteLine($"Maximum depth: {profile.MaximumDepth}m");
            Console.WriteLine($"Average depth: {profile.AverageDepth}m");
            Console.WriteLine($"Total time: {profile.TotalTime}sec");

            Console.WriteLine($"Deco Ceiling: {algo.Ceiling}");

            foreach (var tissue in algo.Tissues)
            {
                Console.WriteLine($"Tissue {tissue.Number}: PN2 {tissue.PN2}, Ceiling: {tissue.GetCeiling(profile.TotalTime)}");
            }

            var dbTable = InitializeDiveDataTable();

            foreach (var t in profile.ProfileByTime.Keys)
            {
                var newRow = dbTable.NewRow();

                newRow["DiveTime"] = t;
                newRow["Depth"] = profile.ProfileByTime[t].depth;
                newRow["Ceiling"] = algo.GetCeiling(t);
                newRow["GasPO2"] = profile.GetPO2(t);
                newRow["GasPN2"] = profile.GetPN2(t);

                foreach (var tissue in algo.Tissues)
                {
                    newRow[$"Tissue{tissue.Number:00}PN2"] = tissue.GetPN2(t);
                    newRow[$"Tissue{tissue.Number:00}MValue"] = tissue.GetMValue(t);
                    newRow[$"Tissue{tissue.Number:00}Ceiling"] = tissue.GetCeiling(t);
                }

                dbTable.Rows.Add(newRow);
            }

            WriteToDatabase(dbTable);
        }

        private static void WriteToDatabase(DataTable dbTable)
        {
            var connectionString = "Server=localhost;Database=DivingCalculator;Trusted_Connection=True;";
            var connection = new SqlConnection(connectionString);
            connection.Open();

            var truncateCommand = new SqlCommand($"TRUNCATE TABLE {dbTable.TableName}", connection);
            truncateCommand.ExecuteNonQuery();

            var bulkCopy = new SqlBulkCopy(connection, SqlBulkCopyOptions.TableLock, null)
            {
                DestinationTableName = dbTable.TableName,
                BulkCopyTimeout = 0
            };

            bulkCopy.WriteToServer(dbTable);
        }

        private static DataTable InitializeDiveDataTable()
        {
            var table = new DataTable();
            table.TableName = "DiveData";

            table.Columns.Add("DiveTime", typeof(int));
            table.Columns.Add("Depth", typeof(double));
            table.Columns.Add("Ceiling", typeof(double));
            table.Columns.Add("GasPO2", typeof(double));
            table.Columns.Add("GasPN2", typeof(double));
            table.Columns.Add("Tissue01PN2", typeof(double));
            table.Columns.Add("Tissue01MValue", typeof(double));
            table.Columns.Add("Tissue01Ceiling", typeof(double));
            table.Columns.Add("Tissue02PN2", typeof(double));
            table.Columns.Add("Tissue02MValue", typeof(double));
            table.Columns.Add("Tissue02Ceiling", typeof(double));
            table.Columns.Add("Tissue03PN2", typeof(double));
            table.Columns.Add("Tissue03MValue", typeof(double));
            table.Columns.Add("Tissue03Ceiling", typeof(double));
            table.Columns.Add("Tissue04PN2", typeof(double));
            table.Columns.Add("Tissue04MValue", typeof(double));
            table.Columns.Add("Tissue04Ceiling", typeof(double));
            table.Columns.Add("Tissue05PN2", typeof(double));
            table.Columns.Add("Tissue05MValue", typeof(double));
            table.Columns.Add("Tissue05Ceiling", typeof(double));
            table.Columns.Add("Tissue06PN2", typeof(double));
            table.Columns.Add("Tissue06MValue", typeof(double));
            table.Columns.Add("Tissue06Ceiling", typeof(double));
            table.Columns.Add("Tissue07PN2", typeof(double));
            table.Columns.Add("Tissue07MValue", typeof(double));
            table.Columns.Add("Tissue07Ceiling", typeof(double));
            table.Columns.Add("Tissue08PN2", typeof(double));
            table.Columns.Add("Tissue08MValue", typeof(double));
            table.Columns.Add("Tissue08Ceiling", typeof(double));
            table.Columns.Add("Tissue09PN2", typeof(double));
            table.Columns.Add("Tissue09MValue", typeof(double));
            table.Columns.Add("Tissue09Ceiling", typeof(double));
            table.Columns.Add("Tissue10PN2", typeof(double));
            table.Columns.Add("Tissue10MValue", typeof(double));
            table.Columns.Add("Tissue10Ceiling", typeof(double));
            table.Columns.Add("Tissue11PN2", typeof(double));
            table.Columns.Add("Tissue11MValue", typeof(double));
            table.Columns.Add("Tissue11Ceiling", typeof(double));
            table.Columns.Add("Tissue12PN2", typeof(double));
            table.Columns.Add("Tissue12MValue", typeof(double));
            table.Columns.Add("Tissue12Ceiling", typeof(double));
            table.Columns.Add("Tissue13PN2", typeof(double));
            table.Columns.Add("Tissue13MValue", typeof(double));
            table.Columns.Add("Tissue13Ceiling", typeof(double));
            table.Columns.Add("Tissue14PN2", typeof(double));
            table.Columns.Add("Tissue14MValue", typeof(double));
            table.Columns.Add("Tissue14Ceiling", typeof(double));
            table.Columns.Add("Tissue15PN2", typeof(double));
            table.Columns.Add("Tissue15MValue", typeof(double));
            table.Columns.Add("Tissue15Ceiling", typeof(double));
            table.Columns.Add("Tissue16PN2", typeof(double));
            table.Columns.Add("Tissue16MValue", typeof(double));
            table.Columns.Add("Tissue16Ceiling", typeof(double));

            return table;
        }
    }
}
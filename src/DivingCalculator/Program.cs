using System.Data;
using System.Data.SqlClient;

namespace DivingCalculator
{
    internal class Program
    {
        // TODO: Tooltip shows all tissues
        // TODO: validate safe ascent rates
        static void Main()
        {
            var air = new BreathingGas(0.21, 0.79, 0);
            var ean12 = new BreathingGas(0.12, 0.88, 0);
            var ean24 = new BreathingGas(0.24, 0.76, 0);
            var ean35 = new BreathingGas(0.35, 0.65, 0);
            var ean40 = new BreathingGas(0.4, 0.6, 0);
            var ean50 = new BreathingGas(0.50, 0.50, 0);
            var ean64 = new BreathingGas(0.64, 0.36, 0);
            var ean66 = new BreathingGas(0.66, 0.34, 0);
            var ean84 = new BreathingGas(0.84, 0.16, 0);
            var oxygen = new BreathingGas(1.0, 0, 0);

            var trimix_12_53 = new BreathingGas(0.12, 0.35, 0.53);
            var trimix_24_16 = new BreathingGas(0.24, 0.60, 0.16);

            var profile = new DiveProfile(air);

            // BENT + NARC'D
            //profile.SetDepth(100, 240);
            //profile.SetDepth(100, 3600);
            //profile.SetDepth(6, 3840);
            //profile.SetDepth(6, 7440);
            //profile.SetDepth(0, 7460);

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
            //profile.SetDepth(50, 120);
            //profile.SetGas(ean12, 120);

            //profile.SetDepth(100, 240);
            //profile.SetDepth(100, 3600);

            //profile.SetDepth(55, 3660);
            //profile.SetGas(ean24, 3660);
            //profile.SetDepth(55, 7260);

            //profile.SetDepth(35, 7320);
            //profile.SetGas(ean35, 7320);
            //profile.SetDepth(35, 10920);

            //profile.SetDepth(22, 10980);
            //profile.SetGas(ean50, 10980);
            //profile.SetDepth(22, 14580);

            //profile.SetDepth(14, 14640);
            //profile.SetGas(ean66, 14640);
            //profile.SetDepth(14, 18180);

            //profile.SetDepth(9, 18240);
            //profile.SetGas(ean84, 18240);
            //profile.SetDepth(9, 21840);

            //profile.SetDepth(6, 21900);
            //profile.SetGas(oxygen, 21900);
            //profile.SetDepth(6, 32700);
            //profile.SetDepth(0, 32720);

            // WITH HELIUM
            profile.SetDepth(40, 120);
            profile.SetGas(trimix_12_53, 120);

            profile.SetDepth(100, 240);
            profile.SetDepth(100, 3600);

            profile.SetDepth(55, 3660);
            profile.SetGas(trimix_24_16, 3660);
            profile.SetDepth(55, 7260);

            profile.SetDepth(30, 7320);
            profile.SetGas(ean40, 7320);
            profile.SetDepth(30, 10920);

            profile.SetDepth(15, 10980);
            profile.SetGas(ean64, 10980);
            profile.SetDepth(15, 14580);

            profile.SetDepth(9, 14640);
            profile.SetGas(ean84, 14640);
            profile.SetDepth(9, 18180);

            profile.SetDepth(6, 18240);
            profile.SetGas(oxygen, 18240);
            profile.SetDepth(6, 27000);
            profile.SetDepth(0, 27020);


            // SO MUCH HELIUM!!!
            //profile = new DiveProfile(new BreathingGas(0.21, 0, 0.79));

            //profile.SetDepth(40, 120);
            //profile.SetGas(new BreathingGas(0.12, 0, 0.88), 120);

            //profile.SetDepth(100, 240);
            //profile.SetDepth(100, 3600);

            //profile.SetDepth(60, 3660);
            //profile.SetGas(new BreathingGas(0.22, 0, 0.78), 3660);
            //profile.SetDepth(60, 7260);

            //profile.SetDepth(40, 7320);
            //profile.SetGas(new BreathingGas(0.32, 0, 0.68), 7320);
            //profile.SetDepth(40, 10920);

            //profile.SetDepth(30, 10980);
            //profile.SetGas(new BreathingGas(0.4, 0, 0.6), 10980);
            //profile.SetDepth(30, 14580);

            //profile.SetDepth(20, 14640);
            //profile.SetGas(new BreathingGas(0.53, 0, 0.47), 14640);
            //profile.SetDepth(20, 18180);

            //profile.SetDepth(15, 18240);
            //profile.SetGas(new BreathingGas(0.64, 0, 0.36), 18240);
            //profile.SetDepth(15, 21840);

            //profile.SetDepth(10, 21900);
            //profile.SetGas(new BreathingGas(0.8, 0, 0.2), 21900);
            //profile.SetDepth(10, 25500);

            //profile.SetDepth(7, 25560);
            //profile.SetGas(new BreathingGas(0.94, 0, 0.06), 25560);
            //profile.SetDepth(7, 29160);

            //profile.SetDepth(6, 29220);
            //profile.SetGas(oxygen, 29220);
            //profile.SetDepth(6, 35500);
            //profile.SetDepth(0, 35520);

            var algo = new BuhlmannZHL16C(profile);

            Console.WriteLine($"Maximum depth: {profile.MaximumDepth}m");
            Console.WriteLine($"Average depth: {profile.AverageDepth}m");
            Console.WriteLine($"Total time: {profile.TotalTime}sec");

            var dbTable = InitializeDiveDataTable();

            var ceilingViolation = 0.0;
            var ceilingViolationTime = 0;
            var ppO2Violation = 0.0;
            var ppO2ViolationTime = 0;
            var narcoticViolation = 0.0;
            var narcoticViolationTime = 0;

            foreach (var t in profile.ProfileByTime.Keys)
            {
                var newRow = dbTable.NewRow();

                newRow["DiveTime"] = t;
                newRow["Depth"] = profile.ProfileByTime[t].depth;
                newRow["Ceiling"] = algo.GetCeiling(t);
                newRow["GasPO2"] = profile.GetPO2(t);
                newRow["GasPN2"] = profile.GetPN2(t);
                newRow["GasPHe"] = profile.GetPHe(t);
                newRow["EAD"] = profile.GetEAD(t);

                foreach (var tissue in algo.Tissues)
                {
                    newRow[$"Tissue{tissue.Number:00}PN2"] = tissue.GetPN2(t);
                    newRow[$"Tissue{tissue.Number:00}PHe"] = tissue.GetPHe(t);
                    newRow[$"Tissue{tissue.Number:00}PTotal"] = tissue.GetPTotal(t);
                    newRow[$"Tissue{tissue.Number:00}MValue"] = tissue.GetMValue(t);
                    newRow[$"Tissue{tissue.Number:00}Ceiling"] = tissue.GetCeiling(t);
                }

                dbTable.Rows.Add(newRow);

                if (algo.GetCeiling(t) > profile.GetDepth(t))
                {
                    var violation = algo.GetCeiling(t) - profile.GetDepth(t);

                    if (violation > ceilingViolation)
                    {
                        ceilingViolation = violation;
                        ceilingViolationTime = t;
                    }
                }

                if (profile.GetPO2(t) > 1.6)
                {
                    if (profile.GetPO2(t) > ppO2Violation)
                    {
                        ppO2Violation = profile.GetPO2(t);
                        ppO2ViolationTime = t;
                    }
                }

                if (profile.GetEAD(t) > 40)
                {
                    if (profile.GetEAD(t) > narcoticViolation)
                    {
                        narcoticViolation = profile.GetEAD(t);
                        narcoticViolationTime = t;
                    }
                }
            }

            WriteToDatabase(dbTable);

            if (ceilingViolation > 0)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"UNSAFE: Exceeded ceiling by {ceilingViolation:f1}m at {ceilingViolationTime} sec");
                Console.ResetColor();
            }

            if (ppO2Violation > 0)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"UNSAFE: Max PO2 was {ppO2Violation:f2} at {ppO2ViolationTime} sec");
                Console.ResetColor();
            }

            if (narcoticViolation > 0)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"UNSAFE: Max EAD was {narcoticViolation:f1}m at {narcoticViolationTime} sec");
                Console.ResetColor();
            }

            if (ceilingViolation == 0 && ppO2Violation == 0 && narcoticViolation == 0)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"SAFE DIVE!");
                Console.ResetColor();
            }

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
            table.Columns.Add("GasPHe", typeof(double));
            table.Columns.Add("EAD", typeof(double));
            table.Columns.Add("Tissue01PN2", typeof(double));
            table.Columns.Add("Tissue01PHe", typeof(double));
            table.Columns.Add("Tissue01PTotal", typeof(double));
            table.Columns.Add("Tissue01MValue", typeof(double));
            table.Columns.Add("Tissue01Ceiling", typeof(double));
            table.Columns.Add("Tissue02PN2", typeof(double));
            table.Columns.Add("Tissue02PHe", typeof(double));
            table.Columns.Add("Tissue02PTotal", typeof(double));
            table.Columns.Add("Tissue02MValue", typeof(double));
            table.Columns.Add("Tissue02Ceiling", typeof(double));
            table.Columns.Add("Tissue03PN2", typeof(double));
            table.Columns.Add("Tissue03PHe", typeof(double));
            table.Columns.Add("Tissue03PTotal", typeof(double));
            table.Columns.Add("Tissue03MValue", typeof(double));
            table.Columns.Add("Tissue03Ceiling", typeof(double));
            table.Columns.Add("Tissue04PN2", typeof(double));
            table.Columns.Add("Tissue04PHe", typeof(double));
            table.Columns.Add("Tissue04PTotal", typeof(double));
            table.Columns.Add("Tissue04MValue", typeof(double));
            table.Columns.Add("Tissue04Ceiling", typeof(double));
            table.Columns.Add("Tissue05PN2", typeof(double));
            table.Columns.Add("Tissue05PHe", typeof(double));
            table.Columns.Add("Tissue05PTotal", typeof(double));
            table.Columns.Add("Tissue05MValue", typeof(double));
            table.Columns.Add("Tissue05Ceiling", typeof(double));
            table.Columns.Add("Tissue06PN2", typeof(double));
            table.Columns.Add("Tissue06PHe", typeof(double));
            table.Columns.Add("Tissue06PTotal", typeof(double));
            table.Columns.Add("Tissue06MValue", typeof(double));
            table.Columns.Add("Tissue06Ceiling", typeof(double));
            table.Columns.Add("Tissue07PN2", typeof(double));
            table.Columns.Add("Tissue07PHe", typeof(double));
            table.Columns.Add("Tissue07PTotal", typeof(double));
            table.Columns.Add("Tissue07MValue", typeof(double));
            table.Columns.Add("Tissue07Ceiling", typeof(double));
            table.Columns.Add("Tissue08PN2", typeof(double));
            table.Columns.Add("Tissue08PHe", typeof(double));
            table.Columns.Add("Tissue08PTotal", typeof(double));
            table.Columns.Add("Tissue08MValue", typeof(double));
            table.Columns.Add("Tissue08Ceiling", typeof(double));
            table.Columns.Add("Tissue09PN2", typeof(double));
            table.Columns.Add("Tissue09PHe", typeof(double));
            table.Columns.Add("Tissue09PTotal", typeof(double));
            table.Columns.Add("Tissue09MValue", typeof(double));
            table.Columns.Add("Tissue09Ceiling", typeof(double));
            table.Columns.Add("Tissue10PN2", typeof(double));
            table.Columns.Add("Tissue10PHe", typeof(double));
            table.Columns.Add("Tissue10PTotal", typeof(double));
            table.Columns.Add("Tissue10MValue", typeof(double));
            table.Columns.Add("Tissue10Ceiling", typeof(double));
            table.Columns.Add("Tissue11PN2", typeof(double));
            table.Columns.Add("Tissue11PHe", typeof(double));
            table.Columns.Add("Tissue11PTotal", typeof(double));
            table.Columns.Add("Tissue11MValue", typeof(double));
            table.Columns.Add("Tissue11Ceiling", typeof(double));
            table.Columns.Add("Tissue12PN2", typeof(double));
            table.Columns.Add("Tissue12PHe", typeof(double));
            table.Columns.Add("Tissue12PTotal", typeof(double));
            table.Columns.Add("Tissue12MValue", typeof(double));
            table.Columns.Add("Tissue12Ceiling", typeof(double));
            table.Columns.Add("Tissue13PN2", typeof(double));
            table.Columns.Add("Tissue13PHe", typeof(double));
            table.Columns.Add("Tissue13PTotal", typeof(double));
            table.Columns.Add("Tissue13MValue", typeof(double));
            table.Columns.Add("Tissue13Ceiling", typeof(double));
            table.Columns.Add("Tissue14PN2", typeof(double));
            table.Columns.Add("Tissue14PHe", typeof(double));
            table.Columns.Add("Tissue14PTotal", typeof(double));
            table.Columns.Add("Tissue14MValue", typeof(double));
            table.Columns.Add("Tissue14Ceiling", typeof(double));
            table.Columns.Add("Tissue15PN2", typeof(double));
            table.Columns.Add("Tissue15PHe", typeof(double));
            table.Columns.Add("Tissue15PTotal", typeof(double));
            table.Columns.Add("Tissue15MValue", typeof(double));
            table.Columns.Add("Tissue15Ceiling", typeof(double));
            table.Columns.Add("Tissue16PN2", typeof(double));
            table.Columns.Add("Tissue16PHe", typeof(double));
            table.Columns.Add("Tissue16PTotal", typeof(double));
            table.Columns.Add("Tissue16MValue", typeof(double));
            table.Columns.Add("Tissue16Ceiling", typeof(double));

            return table;
        }
    }
}
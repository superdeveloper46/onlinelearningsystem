using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.Serialization.Formatters.Binary;
using System.Web;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using LMS.Common.Infos;
using Syncfusion.XlsIO;
using System.Security.Cryptography;
using OfficeOpenXml;

namespace Compilers
{
    public class ExcelCompiler : CloudCompiler
    {
        internal ExcelCompiler(string folder) : base(folder) { }

        #region Updated Code
        public string ReadExcel(Stream streamData)
        {
            using (SpreadsheetDocument doc = SpreadsheetDocument.Open(streamData, true))
            {
                WorkbookPart workbookPart = doc.WorkbookPart;
                SharedStringTablePart sstpart = workbookPart.GetPartsOfType<SharedStringTablePart>().First();
                SharedStringTable sst = sstpart.SharedStringTable;

                WorksheetPart worksheetPart = workbookPart.WorksheetParts.First();
                Worksheet sheet = worksheetPart.Worksheet;

                var cells = sheet.Descendants<Cell>();
                var rows = sheet.Descendants<Row>();
                // One way: go through each cell in the sheet
                foreach (Cell cell in cells)
                {
                    if ((cell.DataType != null) && (cell.DataType == CellValues.SharedString))
                    {
                        int ssid = int.Parse(cell.CellValue.Text);
                        string str = sst.ChildElements[ssid].InnerText;
                        Console.WriteLine("Shared string {0}: {1}", ssid, str);
                    }
                    else if (cell.CellValue != null)
                    {
                        Console.WriteLine("Cell contents: {0}", cell.CellValue.Text);
                    }
                }

                // Or... via each row
                foreach (Row row in rows)
                {
                    foreach (Cell c in row.Elements<Cell>())
                    {
                        if ((c.DataType != null) && (c.DataType == CellValues.SharedString))
                        {
                            int ssid = int.Parse(c.CellValue.Text);
                            string str = sst.ChildElements[ssid].InnerText;
                            Console.WriteLine("Shared string {0}: {1}", ssid, str);
                        }
                        else if (c.CellValue != null)
                        {
                            Console.WriteLine("Cell contents: {0}", c.CellValue.Text);
                        }
                    }
                }

                string path = Directory.GetCurrentDirectory();
                path += DateTime.Now.Ticks + ".xlsx";
                doc.SaveAs(path);

                return path;
            }
        }
        //public override ExecutionResult Run(RunInfo runInfo, CompilerInfo compilerInfo)
        //{
        //    ExecutionResult er = new ExecutionResult
        //    {
        //        Grade = 0,
        //        Compiled = true
        //    };

        //    if (!string.IsNullOrEmpty(runInfo.Code) && !string.IsNullOrEmpty(runInfo.ExpectedResult))
        //    {
        //        List<string> differences = new List<string>();

        //        MemoryStream studWorkbookMs = GetStreamFromBinary(runInfo.Code);
        //        MemoryStream solWorkbookMs = GetStreamFromBinary(runInfo.ExpectedResult);

        //        Stream studWorkbookStream = studWorkbookMs;
        //        Stream solWorkbookStream = solWorkbookMs;

        //        // using Microsoft.Office.Interop.Excel
        //        //string studentExcelFilePath = ReadExcel(studWorkbookStream);
        //        //string solExcelFilePath = ReadExcel(solWorkbookStream);
        //        //bool isSucess = compareFiles(studentExcelFilePath, solExcelFilePath);

        //        ////Student Workbook Submited
        //        SpreadsheetDocument studWorkbookDoc = SpreadsheetDocument.Open(studWorkbookStream, true);
        //        WorkbookPart studWorkbookPart = studWorkbookDoc.WorkbookPart;
        //        SharedStringTablePart studWorkbookSSTpart = studWorkbookPart.GetPartsOfType<SharedStringTablePart>().First();
        //        SharedStringTable studWorkbookSST = studWorkbookSSTpart.SharedStringTable;

        //        WorksheetPart studworksheetPart = studWorkbookPart.WorksheetParts.First();
        //        Worksheet studSheets = studworksheetPart.Worksheet;

        //        //Solution WorkBook
        //        SpreadsheetDocument solWorkbookDoc = SpreadsheetDocument.Open(solWorkbookStream, true);
        //        WorkbookPart solWorkbookPart = solWorkbookDoc.WorkbookPart;
        //        SharedStringTablePart solWorkbookSSTpart = solWorkbookPart.GetPartsOfType<SharedStringTablePart>().First();
        //        SharedStringTable solWorkbookSST = solWorkbookSSTpart.SharedStringTable;

        //        WorksheetPart solworksheetPart = solWorkbookPart.WorksheetParts.First();
        //        Worksheet solSheets = solworksheetPart.Worksheet;


        //        int studSheetsCount = studSheets.Count();
        //        int solSheetsCount = solSheets.Count();
        //        if (studSheetsCount != solSheetsCount)
        //        {
        //            differences.Add("Expected number of Worksheet: " + solSheetsCount + ", Actual number of Worksheet: " + studSheetsCount);
        //        }

        //        //for (int i = 0; i < solSheetsCount; i++)
        //        //{
        //        //    //WorksheetPart worksheetPart = studworksheetPart.Worksheet.FirstOrDefault(x => x.id);
        //        //    WorksheetPart worksheetPart = studWorkbookPart.Workbook.Descendants(Worksheet)().First(s => s.Id.Equals(2)).Id;
        //        //    Worksheet sheet = worksheetPart.Worksheet;

        //        //    //Worksheet sheet = solSheets.WorksheetPart.Worksheet.[i];
        //        //    //// Get worksheets by name
        //        //    Worksheet solutionWorkSheet = (Worksheet)solSheets.FirstOrDefault(x => x.XName == sheet.XName);
        //        //    Worksheet studentWorksheet = (Worksheet)studSheets.FirstOrDefault(x => x.XName == sheet.XName);

        //        //    if (studentWorksheet == null)
        //        //    {
        //        //        differences.Add("No Worksheet named " + sheet.XName + " was found in the file.");
        //        //        continue;
        //        //    }
        //        //}
        //    }

        //    return er;
        //}

        //Using Microsoft.Office.Interop.Excel
        public bool compareFiles(string filePath1, string filePath2)
        {
            bool result = false;
            Microsoft.Office.Interop.Excel.Application excel = new Microsoft.Office.Interop.Excel.Application();

            //Excel.Application excel = new Excel.Application();

            //Open files to compare
            Microsoft.Office.Interop.Excel.Workbook workbook1 = excel.Workbooks.Open(filePath1);
            Microsoft.Office.Interop.Excel.Workbook workbook2 = excel.Workbooks.Open(filePath2);

            //Open sheets to grab values from
            //DocumentFormat.OpenXml.Office.Excel.Worksheet worksheet1 = (Microsoft.Office.Interop.Excel.Worksheet)workbook1.Sheets[1];

            Microsoft.Office.Interop.Excel.Worksheet worksheet1 = (Microsoft.Office.Interop.Excel.Worksheet)workbook1.Sheets[1];
            Microsoft.Office.Interop.Excel.Worksheet worksheet2 = (Microsoft.Office.Interop.Excel.Worksheet)workbook2.Sheets[1];

            //Get the used range of cells
            Microsoft.Office.Interop.Excel.Range range = worksheet2.UsedRange;
            int maxColumns = range.Columns.Count;
            int maxRows = range.Rows.Count;

            //Check that each cell matches
            for (int i = 1; i <= maxColumns; i++)
            {
                for (int j = 1; j <= maxRows; j++)
                {
                    if (worksheet1.Cells[j, i] == worksheet2.Cells[j, i])
                    {
                        result = true;
                    }
                    else
                        result = false;
                }
            }


            //Close the workbooks
            GC.Collect();
            GC.WaitForPendingFinalizers();
            Marshal.ReleaseComObject(range);
            Marshal.ReleaseComObject(worksheet1);
            Marshal.ReleaseComObject(worksheet2);
            workbook1.Close();
            workbook2.Close();
            excel.Quit();
            Marshal.ReleaseComObject(excel);

            //Tell us if it is true or false
            return result;
        }

        public override ExecutionResult Run(RunInfo runInfo, CompilerInfo compilerInfo)
        {
            ExecutionResult er = new ExecutionResult
            {
                Grade = 0,
                Compiled = true
            };
            return er;
        }

        #endregion

        #region Old Code
        //public override ExecutionResult Run(RunInfo runInfo, CompilerInfo compilerInfo)
        //{
        //    exeCompiler com = new exeCompiler();


        //    ExecutionResult er = new ExecutionResult
        //    {
        //        Grade = 0,
        //        Compiled = true
        //    };

        //    if (!string.IsNullOrEmpty(runInfo.Code) && !string.IsNullOrEmpty(runInfo.ExpectedResult))
        //    {
        //        List<string> differences = new List<string>();

        //        ExcelEngine excelEngine = new ExcelEngine();
        //        IWorkbook studWorkbook = excelEngine.Excel.Workbooks.Open(GetStreamFromBinary(runInfo.Code));
        //        IWorksheets studSheets = studWorkbook.Worksheets;

        //        IWorkbook solWorkbook = excelEngine.Excel.Workbooks.Open(GetStreamFromBinary(runInfo.ExpectedResult));
        //        IWorksheets solSheets = solWorkbook.Worksheets;


        //        if (studSheets.Count != solSheets.Count)
        //        {
        //            differences.Add("Expected number of Worksheet: " + solSheets.Count + ", Actual number of Worksheet: " + studSheets.Count);
        //        }

        //        for (int i = 0; i < solSheets.Count; i++)
        //        {
        //            IWorksheet sheet = solSheets[i];

        //            // Get worksheets by name
        //            IWorksheet solutionWorkSheet = solSheets.FirstOrDefault(x => x.Name == sheet.Name);
        //            IWorksheet studentWorksheet = studSheets.FirstOrDefault(x => x.Name == sheet.Name);

        //            if (studentWorksheet == null)
        //            {
        //                differences.Add("No Worksheet named " + sheet.Name + " was found in the file.");
        //                continue;
        //            }


        //            //---------------compare charts-------------------------------------

        //            IChartShapes solutionCharts = solutionWorkSheet.Charts;
        //            IChartShapes studentCharts = studentWorksheet.Charts;

        //            if (solutionCharts.Count != studentCharts.Count)
        //            {
        //                differences.Add("Your file must have " + solutionCharts.Count + " chart(s)");
        //            }
        //            else if (solutionCharts.Count != 0)
        //            {
        //                for (int j = 0; j < solutionCharts.Count; j++)
        //                {
        //                    if (solutionCharts[j].ChartType != studentCharts[j].ChartType)
        //                    {
        //                        differences.Add("In " + sheet.Name + ", chart #" + (j + 1) + " has wrong type");
        //                    }
        //                    else
        //                    {
        //                        List<IChartSerie> solutionChartData = solutionCharts[j].Series.ToList();
        //                        List<IChartSerie> studentChartData = studentCharts[j].Series.ToList();

        //                        bool chartDataIsEqual = true;
        //                        if (solutionChartData.Count != studentChartData.Count)
        //                        {
        //                            chartDataIsEqual = false;
        //                        }
        //                        else
        //                        {
        //                            for (int k = 0; k < solutionChartData.Count; k++)
        //                            {

        //                                IRange[] solutionSeries = solutionChartData[k].Values.Cells;
        //                                IRange[] studentSeries = studentChartData[k].Values.Cells;
        //                                if (solutionSeries.Count() != studentSeries.Count())
        //                                {
        //                                    chartDataIsEqual = false;
        //                                    break;
        //                                }
        //                                else
        //                                {
        //                                    //----------check trendlines------
        //                                    IChartTrendLines solutionTrendlines = solutionChartData[k].TrendLines;
        //                                    IChartTrendLines studentTrendlines = studentChartData[k].TrendLines;
        //                                    if (solutionTrendlines.Count != studentTrendlines.Count)
        //                                    {
        //                                        differences.Add("In " + sheet.Name + ", chart #" + (j + 1) + " must have " + solutionTrendlines.Count + " trendline(s)");
        //                                    }
        //                                    else
        //                                    {
        //                                        for (int n = 0; n < solutionTrendlines.Count; n++)
        //                                        {
        //                                            if (solutionTrendlines[n].Type != studentTrendlines[n].Type)
        //                                            {
        //                                                differences.Add("In " + sheet.Name + ", chart #" + (j + 1) + " , trendline # " + (n + 1) + " has a wrong type");
        //                                            }
        //                                        }

        //                                    }

        //                                    //----------check chart data------
        //                                    for (int m = 0; m < solutionSeries.Count(); m++)
        //                                    {
        //                                        if (solutionSeries[m].Value != studentSeries[m].Value)
        //                                        {
        //                                            chartDataIsEqual = false;
        //                                            break;
        //                                        }
        //                                    }
        //                                    if (!chartDataIsEqual)
        //                                    {
        //                                        break;
        //                                    }
        //                                }
        //                            }
        //                            if (!chartDataIsEqual)
        //                            {
        //                                differences.Add("In " + sheet.Name + ", chart #" + (j + 1) + " has wrong data");
        //                            }
        //                        }
        //                    }
        //                }
        //            }

        //            IRange[] solutionData = solutionWorkSheet.Cells;
        //            IRange[] studentData = studentWorksheet.Cells;
        //            int solutionCount = solutionData.Count();
        //            int studentCount = studentData.Count();

        //            Dictionary<string, string> solutionValues = new Dictionary<string, string>();

        //            foreach (IRange cell in solutionData)
        //            {
        //                if (cell.Value != "")
        //                {
        //                    solutionValues.Add(CellName(cell.AddressR1C1Local), ReplaceFuntion(cell.Value));
        //                }
        //            }

        //            foreach (IRange cell in studentData)
        //            {
        //                if (cell.Value == "")
        //                {
        //                    continue;
        //                }

        //                string name = CellName(cell.AddressR1C1Local);
        //                if (solutionValues.ContainsKey(name))
        //                {
        //                    if (cell.Value != solutionValues[name])
        //                    {
        //                        differences.Add("Sheet: " + sheet.Name + "; Cell: " + name + "; Value: " + cell.Value + " is different. Expected: " + solutionValues[name]);
        //                    }
        //                    _ = solutionValues.Remove(name);
        //                }
        //                else
        //                {
        //                    differences.Add("Sheet: " + sheet.Name + "; Cell: " + name + "; Value: " + cell.Value + " is different. Expected: Empty Cell");
        //                }
        //            }
        //            foreach (KeyValuePair<string, string> row in solutionValues)
        //            {
        //                differences.Add("Sheet: " + sheet.Name + "; Cell: " + row.Key + "; Missing Value: " + row.Value);
        //            }
        //            er.Grade += 100 - (100 * differences.Count / Math.Max(solutionCount, studentCount));
        //        }
        //        er.Grade /= solSheets.Count;

        //        er.Succeeded = true;
        //        er.ActualErrors = differences;
        //        // Close document
        //        studWorkbook.Close();
        //        solWorkbook.Close();
        //    }

        //    return er;
        //}
        #endregion

        private System.Data.DataTable GetDataTableFromBinary(string binaryStr)
        {
            System.Data.DataTable dt;
            // Deserializing into datatable
            byte[] byteFile = Convert.FromBase64String(binaryStr);
            using (MemoryStream stream = new MemoryStream(byteFile))
            {
                BinaryFormatter bformatter = new BinaryFormatter();
                dt = (System.Data.DataTable)bformatter.Deserialize(stream);

            }
            // Adding DataTable into DataSet 

            //using (StringWriter sw = new StringWriter())
            //{
            //    dt.WriteXml(sw);
            //    CreateXMLFILE = sw.ToString();
            //}
            return dt;
        }
        private MemoryStream GetStreamFromBinary(string binaryStr)
        {
            byte[] byteFile = Convert.FromBase64String(binaryStr);
            MemoryStream ms = new MemoryStream();
            ms.Write(byteFile, 0, byteFile.Length);
            ms.Position = 0;
            return ms;
        }
        // Get column header's field name
        private static string CellName(string addressR1C1)
        {
            string name;
            string row;
            int col;
            int rPosition = addressR1C1.IndexOf("R");
            int cPosition = addressR1C1.IndexOf("C");
            try
            {
                row = addressR1C1.Substring(rPosition + 1, cPosition - rPosition - 1);
                col = int.Parse(addressR1C1.Substring(cPosition + 1)) - 1;
            }
            catch (Exception /*e*/)
            {
                return addressR1C1;
            }

            int dec = col / 26;
            int num = col % 26;

            name = char.ConvertFromUtf32(Convert.ToInt32('A') + num);

            if (dec > 0)
            {
                name = char.ConvertFromUtf32(Convert.ToInt32('A') + dec) + name;
            }

            name += row;
            return name;
        }
    }
}



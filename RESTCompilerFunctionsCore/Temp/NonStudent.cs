//Test

using Microsoft.VisualStudio.TestTools.UnitTesting;
                using System;
                using System.Collections.Generic;

                public partial class MissingNumber
                {
                    public int FindMissing(int[] arr)
                    {
                        // Your code starts here
                        int res = 0;
                        int NonStudent;
                        int ${{a,1}};
                        int ${total} = ${{a,2}} + ${{b}};
                        return ${{total}};
                        // Your code ends here
                    }
                }

public partial class MissingNumberSol
                {
                    public int FindMissing(int[] arr)
                    {
                        // Your code starts here
                        int res = 0;
                        int NonStudent;
                        int ${{a,1}};
                        int ${total} = ${{a,2}} + ${{b}};
                        return ${{total}};
                        // Your code ends here
                    }
                }

[TestClass]
                public partial class MissingNumber
                {
                    [TestMethod, Timeout(5000)]
                    public void TestMethod1()
                    {
                        var missingnumber = FindMissing(new int[] { });
                        var missingnumber2 = FindMissing(new int[] { });
                        Assert.AreEqual(0, missingnumber);
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod2()
                    {
                        Assert.AreEqual(1, FindMissing(new int[] { 0, -1}));
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod3()
                    {
                        Random r = new Random();
                        int n = r.Next(10, 20);
                        int i = r.Next(-n, n);
                        int m = 0;
                        List<int> l = new List<int>();
                        for (int j = -n; j <= n; j++)
                        {
                            if (j != i) l.Add(j); else m = j;
                        }
                        List<int> l2 = new List<int>();
                        while (l.Count > 0)
                        {
                            int j = r.Next(0, l.Count - 1);
                            int x = l[j];
                            l2.Add(x);
                            l.Remove(x);
                        }
                        Assert.AreEqual(m, FindMissing(l2.ToArray()));
                    }
                    [TestMethod, Timeout(5000)]
                    public void TestMethod4()
                    {
                        Random r = new Random();
                        int n = r.Next(10, 20);
                        int i = r.Next(-n, n);
                        int m = 0;
                        List<int> l = new List<int>();
                        for (int j = -n; j <= n; j++)
                        {
                            if (j != i) l.Add(j); else m = j;
                        }
                        List<int> l2 = new List<int>();
                        while (l.Count > 0)
                        {
                            int j = r.Next(0, l.Count - 1);
                            int x = l[j];
                            l2.Add(x);
                            l.Remove(x);
                        }
                        Assert.AreEqual(m, FindMissing(l2.ToArray()));
                    }
                }

//Test
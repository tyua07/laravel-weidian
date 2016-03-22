using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Text.RegularExpressions;
using System.IO;

namespace merger
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length <= 1) return;
            string dectFile = args[args.Length - 1];
            if (File.Exists(dectFile)) File.Delete(dectFile);

            string source = string.Empty;
            string pattern = "/// <reference[^>]*?>";
            MatchCollection matchs =
              Regex.Matches(source, pattern,
              RegexOptions.None);
            for (int i = 0, len = args.Length-1; i < len; i++)
            {
                if (!File.Exists(args[i])) continue;
                source = File.ReadAllText(args[i]);
                source = Regex.Replace(source, pattern, string.Empty, RegexOptions.None);
                source = source.Replace("\"pcode.importJS.js\"", "\"pcode.js\"");
                File.AppendAllText(dectFile, source);
            }

        }
    }
}

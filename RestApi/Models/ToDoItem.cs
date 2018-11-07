//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

namespace RestApi.Models
{
    public class TodoItem
    {
        public long key { get { return Id; } } // lower case for react
        public long Id { get; set; }
        public string Name { get; set; }
        public bool IsComplete { get; set; }
    }
}

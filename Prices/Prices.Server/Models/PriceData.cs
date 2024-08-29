using System.ComponentModel.DataAnnotations;

namespace Prices.Server.Models
{
    public class PriceData
    {
        [Key]
        public int ID { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}

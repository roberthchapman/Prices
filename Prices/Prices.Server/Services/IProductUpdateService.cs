using Prices.Server.Models;

namespace Prices.Server.Services
{
    public interface IProductUpdateService
    {
         IEnumerable<PriceData> GetPriceData();
    }
}

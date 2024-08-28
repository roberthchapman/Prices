using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Prices.Server.Models;

namespace Prices.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PriceDataController : ControllerBase
    {
        private readonly IHubContext<SignalRHub> _hubContext;

        private readonly ILogger<PriceDataController> _logger;

        public PriceDataController(ILogger<PriceDataController> logger, IHubContext<SignalRHub> hubContext)
        {
            _logger = logger;
            _hubContext = hubContext;
        }

        [HttpGet(Name = "GetPriceData")]
        public IEnumerable<PriceData> Get()
        {
            DateTime dateTime = DateTime.Now;
            return Enumerable.Range(1, 10).Select(index => new PriceData
            {
                ID = index,
                Name = "Product " + index,
                Price = (decimal)Random.Shared.Next(-50, 100) + (decimal)Math.Round(Random.Shared.NextDouble(), 2),
                UpdatedAt = dateTime,
            });

        }
    }
}

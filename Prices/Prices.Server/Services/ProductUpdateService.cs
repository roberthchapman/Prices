using Microsoft.AspNetCore.SignalR;
using Prices.Server.Models;

namespace Prices.Server.Services
{
        public class ProductUpdateService : IProductUpdateService, IHostedService, IDisposable
        {
            private readonly IHubContext<SignalRHub> _hubContext;
            private Timer _timer;

            public ProductUpdateService(IHubContext<SignalRHub> hubContext)
            {
                _hubContext = hubContext;
            }

            public Task StartAsync(CancellationToken cancellationToken)
            {
                _timer = new Timer(async state => await SendProductUpdates(), null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
                return Task.CompletedTask;
            }

            public IEnumerable<PriceData> GetPriceData()
            {
                DateTime dateTime = DateTime.Now;
                return Enumerable.Repeat(1, 3).Select(_ => Random.Shared.Next(0, 10) + 1).Distinct().Select(index => new PriceData
                {
                    ID = index,
                    Name = "Product " + index,
                    Price = (decimal)Random.Shared.Next(-50, 100) + (decimal)Math.Round(Random.Shared.NextDouble(), 2),
                    UpdatedAt = dateTime,
                });
            }

            private async Task SendProductUpdates()
            {
                var products = GetPriceData();
                await _hubContext.Clients.All.SendAsync("ReceiveProductUpdates", products);
            }

            public Task StopAsync(CancellationToken cancellationToken)
            {
                _timer?.Change(Timeout.Infinite, 0);
                return Task.CompletedTask;
            }

            public void Dispose()
            {
                _timer?.Dispose();
            }
        }
}

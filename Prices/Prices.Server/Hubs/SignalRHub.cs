using Microsoft.AspNetCore.SignalR;

namespace Prices.Server.Hubs
{
    public class SignalRHub : Hub, ISignalRHub
    {
        public async Task NewMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveProductUpdates", user, message);
        }
    }

    public interface ISignalRHub
    {
        Task NewMessage(string user, string message);
    }
}

using Microsoft.AspNetCore.SignalR;

namespace Prices.Server
{
    public class SignalRHub: Hub
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

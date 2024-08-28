import { useEffect, useState } from 'react';
import './App.css';
import { fetchPriceDataAsync, savePriceUpdate, selectPriceData } from './store/priceDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './main';
import { IPriceData } from './models/priceData';
import { NumericFormat } from 'react-number-format';
import { faArrowDown, faArrowUp, faEquals } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
function App() {

    const dispatch = useDispatch<AppDispatch>();
    const priceData = useSelector(selectPriceData);
    const [subscribed, setSubscribed] = useState<boolean>(false);

    const setSubscription = (set: boolean) => {
        setSubscribed(set);
    }

    const [connection, setConnection] = useState<HubConnection>();

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7195/hub')
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection && subscribed) {
            if (!connection.connectionId) {
                connection.start()
                    .then(() => {
                        console.log('Connected');
                        connection.on('ReceiveProductUpdates', (data) => {
                            console.log('New data fetched', data);
                            dispatch(savePriceUpdate(data));
                        });
                    })
                    .catch(e => console.log('Connection failed: ', e));
            }
            else {
                 connection.on('ReceiveProductUpdates', (data) => {
                    console.log('New data fetched', data);
                    dispatch(savePriceUpdate(data));
                });
            }
        }
        if (connection && !subscribed) {
            connection.off('ReceiveProductUpdates');
        }
    }, [connection, subscribed]);

    useEffect(() => {
        //get starting point from Rest API
        dispatch(fetchPriceDataAsync());
    }, [dispatch]);

    return (
        <div style={{ minWidth: '600px' }}>
            <div style={{
                height: '50px', backgroundColor: 'slategray', marginBottom: '30px', borderRadius: '8px',
                display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <label style={{ marginLeft: '50px', fontWeight: '500'} }>Price Updates</label>
                <span>
                    <button style={{ marginRight: '10px' }} disabled={subscribed} onClick={() => setSubscription(true)}>Subscribe</button>
                    <button style={{ marginRight: '5px' }} disabled={!subscribed} onClick={() => setSubscription(false)}>Unsubscribe</button>
                </span>
            </div>
            <h1 id="tableDescription">Price Data</h1>
            {priceData && priceData.length > 0 ?
                <table>
                    <thead>
                        <tr>
                            <td width={50}>ID</td>
                            <td width={100}>Name</td>
                            <td width={70}>Price</td>
                            <td width={50}>Change</td>
                            <td>Updated At</td>
                        </tr>
                    </thead>
                    <tbody>
                        {priceData.map((d: IPriceData) => (
                            <tr key={d.id}>
                                <td>{d.id}</td>
                                <td style={{ textAlign: 'left' }}>{d.name}</td>
                                <td style={{ textAlign: 'right' }}><NumericFormat displayType="text" value={d.price} thousandSeparator="," decimalScale={2} fixedDecimalScale prefix={'$'} /></td>
                                <td>{!d.previousPrice ? '' :
                                    d.price > d.previousPrice ?
                                        <FontAwesomeIcon icon={faArrowUp} />
                                        : d.price < d.previousPrice ?
                                            <FontAwesomeIcon icon={faArrowDown} /> :
                                            <FontAwesomeIcon icon={faEquals} />}</td>
                                <td>{DateTime.fromISO(d.updatedAt).toFormat('HH:mm:ss')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                :
                <div style={{ height: '305px' }}>Loading...</div>

            }
        </div>
    );
}

export default App;

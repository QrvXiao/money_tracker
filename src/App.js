import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { renderToReadableStream } from 'react-dom/server';

function App() {

  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL+'/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {

    ev.preventDefault();

    const url = process.env.REACT_APP_API_URL+'/transaction';

    const price = name.split(' ')[0];

    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        price,
        name:name.substring(price.length+1),
        description,
        datetime})
    }).then(response => {
      response.json().then(json => {
        setTransactions([...transactions, json]);
        console.log(name);
        setName('');
        console.log(name);
        setDatetime('');
        setDescription('');
      });
    });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main>
        <h1>{balance}<span>{'.' + fraction}</span></h1>
        <form onSubmit={addNewTransaction}>
          <div className='basic'>
            <input  type="text"
                    value = {name}
                    onChange = {ev => setName(ev.target.value)} 
                    placeholder='+200 new samsuing tv' />
            <input  value = {datetime}
                    onChange={ev => setDatetime(ev.target.value)} 
                    type="datetime-local" />
          </div>
          <div className='description'>
            <input  type="text" 
                    value = {description}
                    onChange = {ev => setDescription(ev.target.value)}             
                    placeholder='description'/>
          </div>
          <button type="submit">Add new transaction</button>
        </form>
        <div className='transactions'>
          {transactions.length > 0 && transactions.map(transaction => (
          <div className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price "+ (transaction.price < 0?'red':'green')}>{transaction.price}</div>
              <div className="time">{transaction.datetime}</div>
            </div>            
          </div>  
          ))}

          {/* <div className="transaction">
            <div className="left">
              <div className="name">New Samsung TV</div>
              <div className="description">it was time for new tv</div>
            </div>
            <div className="right">
              <div className="price red">-$500</div>
              <div className="time">2022-12-18 15:45</div>
            </div>            
          </div>

          <div className="transaction">
            <div className="left">
              <div className="name">Gig job new website</div>
              <div className="description">it was time for new tv</div>
            </div>
            <div className="right">
              <div className="price green">+$400</div>
              <div className="time">2022-12-18 15:45</div>
            </div>            
          </div> */}


        </div>
        
    </main>
  );
}

export default App;

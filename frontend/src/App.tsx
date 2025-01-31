import ListContainer from './components/ListContainer';

function App() {
  console.log(process.env.REACT_APP_API_SERVER);

  return (
    <>
      <ListContainer />
    </>
  );
}

export default App;

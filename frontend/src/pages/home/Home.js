import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from '../../components/modal/Modal';

import './home.css';

import PlusSvg from '../../assets/svg/plus.svg';
import MinusSvg from '../../assets/svg/minus.svg';

const fakeTodoLists = [
  {
    title: 'Todo-list-0',
    id: '0',
    items: [
      {
        id: '01',
        itemName: 'list-0-name-1',
        isDone: false
      },
      {
        id: '02',
        itemName: 'list-0-name-2',
        isDone: true
      },
      {
        id: '03',
        itemName: 'list-0-name-3',
        isDone: false
      },
      {
        id: '04',
        itemName: 'list-0-name-4',
        isDone: false
      },
      {
        id: '05',
        itemName: 'list-0-name-5',
        isDone: true
      },
    ]
  },
  {
    title: 'Todo-list-1',
    id: '1',
    items: [
      {
        id: '11',
        itemName: 'list-1-name-1',
        isDone: false
      },
      {
        id: '12',
        itemName: 'list-1-name-2',
        isDone: false
      },
      {
        id: '13',
        itemName: 'list-1-name-3',
        isDone: true
      },
      {
        id: '14',
        itemName: 'list-1-name-4',
        isDone: false
      },
      {
        id: '15',
        itemName: 'list-1-name-5',
        isDone: true
      },
    ]
  },
]

var fakeCountId = 2;

const newFakeTodoListTemplate = fakeCountId => (
  {
    title: `list-${fakeCountId}`,
    id: `${fakeCountId.toString}`,
    items: [
      {
        id: `${fakeCountId}1`,
        itemName: `list-${fakeCountId}-name-1`,
        isDone: false
      },
      {
        id: `${fakeCountId}2`,
        itemName: `list-${fakeCountId}-name-2`,
        isDone: true
      },
      {
        id: `${fakeCountId}3`,
        itemName: `list-${fakeCountId}-name-3`,
        isDone: false
      },
      {
        id: `${fakeCountId}4`,
        itemName: `list-${fakeCountId}-name-4`,
        isDone: false
      },
      {
        id: `${fakeCountId}5`,
        itemName: `list-${fakeCountId}-name-5`,
        isDone: true
      },
    ]
  }
)

const Home = () => {

  const initalState = {
    showModal: '',
    haveInput: false,
    inputValue: '',
    modalTitle: '',
    idxList: -1,
    idxItem: -1,
  };

  const [data, setData] = useState(fakeTodoLists);
  const [state, setState] = useState(initalState);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const dataChangeHandle = (buttonType, idxList, idxItem) => {
    switch (buttonType) {
      case 'ADD_LIST':
        setState({
          ...state,
          showModal: 'ADD_LIST',
          haveInput: true,
          inputValue: '',
          modalTitle: 'Add new List',
          idxList: -1,
          idxItem: -1,
        });
        break;
      case 'ADD_ITEM':
        setState({
          ...state,
          showModal: 'ADD_ITEM',
          haveInput: true,
          inputValue: '',
          modalTitle: 'Add new Item',
          idxList: idxList,
          idxItem: -1,
        });
        break;
      case 'REMOVE_LIST':
        setState({
          ...state,
          showModal: 'REMOVE_LIST',
          haveInput: false,
          inputValue: '',
          modalTitle: 'Remove List',
          idxList: idxList,
          idxItem: -1,
        });
      break;
      case 'REMOVE_ITEM':
        setState({
          ...state,
          showModal: 'REMOVE_ITEM',
          haveInput: false,
          inputValue: '',
          modalTitle: 'Remove Item',
          idxList: idxList,
          idxItem: idxItem,
        });
        break;
      default:
        break;
    }
  }

  const onConfirmFunctionSelect = e => {
    e.preventDefault();
    switch (state.showModal) {
      case 'ADD_LIST':
        const newFakeList = {
          title: state.inputValue,
          id: `${fakeCountId++}`,
          items: [],
        };
        setData([...data, newFakeList]);
        break;
      case 'ADD_ITEM':
        const newFakeItem = {
          id: `${fakeCountId++}`,
          itemName: state.inputValue,
          isDone: false,
        };
        const newData = [...data];
        newData[state.idxList].items.push(newFakeItem);
        setData(newData);
        break;
      case 'REMOVE_LIST':
        const _newData = [...data];
        _newData.splice(state.idxList, 1);
        setData(_newData);
      break;
      case 'REMOVE_ITEM':
        const __newData = [...data];
        __newData[state.idxList].items.splice(state.idxItem, 1);
        setData(__newData);
        break;
      default:
        break;
    }
    setState(initalState);
  }

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const newData = [...data];
      newData[sInd].items = reorder(data[sInd].items, source.index, destination.index);;
      setData(newData);
    } else {
      const result = move(data[sInd].items, data[dInd].items, source, destination);
      const newData = [...data];
      newData[sInd].items = result[sInd];
      newData[dInd].items = result[dInd];
      setData(newData);
    }
  }

  return (
    <div
      className='row' 
      style={state.showModal ? 
        {backgroundColor: 'rgba(48, 49, 48, 0.42)',
          height: '100%',
          position: 'fixed',
          width: '100%',
        } 
        : {}}
    >
      <div className='row-content'>
      <div className='lists'>
        <DragDropContext onDragEnd={onDragEnd}>
          {data.map((TodoList, idxList) => (
            <Droppable key={idxList} droppableId={`${idxList}`}>
              {(provided, snapshot) => (
                <div
                  className='list'
                  ref={provided.innerRef}
                  style={{background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey'}}
                  {...provided.droppableProps}
                >
                  <div className='todo-list-title'>
                    <div>
                      {TodoList.title}
                    </div>
                    <button
                      type='button'
                      onClick={() => dataChangeHandle('REMOVE_LIST', idxList)}
                    >
                      <img src={MinusSvg} width='15' alt='Remove list' />
                    </button>
                  </div>
                  {TodoList.items.map((item, idxItem) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={idxItem}
                    >
                      {(provided, snapshot) => (
                        <div
                          className='todo-item'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            // change background colour if dragging
                            background: snapshot.isDragging ? 'lightgreen' : 'grey',
                        
                            // styles we need to apply on draggables
                            ...provided.draggableProps.style
                          }}
                        >
                            <input
                              type='checkbox'
                              checked={item.isDone}
                              onChange={() => {
                                const newData = [...data];
                                newData[idxList].items[idxItem].isDone = !newData[idxList].items[idxItem].isDone;
                                setData(newData)
                              }}  
                            />
                            <div style={{textDecoration: item.isDone ? 'line-through' : 'none'}}>
                            {item.itemName}
                            </div>
                            <button
                              type='button'
                              onClick={() => dataChangeHandle('REMOVE_ITEM', idxList, idxItem)}
                            >
                              <img src={MinusSvg} width='10' alt='Remove item' />
                            </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <div className='new-item'>
                    <button
                      type='button'
                      onClick={() => dataChangeHandle('ADD_ITEM', idxList)}
                    >
                      <img src={PlusSvg} width='20' alt='Add new item' />
                    </button>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <div className='new-list'>
      <button
        type='button'
        onClick={() => dataChangeHandle('ADD_LIST')}
      >
        <img src={PlusSvg} width='30' alt='Add new list'/>
      </button>
      </div>
      </div>
      {state.showModal &&
          <Modal
            title={state.modalTitle}
            canCancel
            canConfirm
            onCancel={() => setState(initalState)}
            onConfirm={onConfirmFunctionSelect}
          >
            {state.haveInput ? 
            <input 
              type='text'
              name='inputValue'
              id='inputValue'
              value={state.inputValue}
              onChange={(event) => setState({
                ...state,
                [event.target.name]: event.target.value,
              })}
            /> :
            <div>
              {state.modalTitle}
            </div>
            }
          </Modal>
      }
    </div>
  );
};

export default Home;
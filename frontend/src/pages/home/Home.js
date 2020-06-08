import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from '../../components/modal/Modal';
import api from '../../services/api';

import './home.css';

import PlusSvg from '../../assets/svg/plus.svg';
import MinusSvg from '../../assets/svg/minus.svg';

// const fakeTodoLists = [
//   {
//     title: 'Todo-list-0',
//     id: '0',
//     tasks: [
//       {
//         id: '01',
//         taskName: 'list-0-name-1',
//         isDone: false
//       },
//       {
//         id: '02',
//         taskName: 'list-0-name-2',
//         isDone: true
//       },
//       {
//         id: '03',
//         taskName: 'list-0-name-3',
//         isDone: false
//       },
//       {
//         id: '04',
//         taskName: 'list-0-name-4',
//         isDone: false
//       },
//       {
//         id: '05',
//         taskName: 'list-0-name-5',
//         isDone: true
//       },
//     ]
//   },
//   {
//     title: 'Todo-list-1',
//     id: '1',
//     tasks: [
//       {
//         id: '11',
//         taskName: 'list-1-name-1',
//         isDone: false
//       },
//       {
//         id: '12',
//         taskName: 'list-1-name-2',
//         isDone: false
//       },
//       {
//         id: '13',
//         taskName: 'list-1-name-3',
//         isDone: true
//       },
//       {
//         id: '14',
//         taskName: 'list-1-name-4',
//         isDone: false
//       },
//       {
//         id: '15',
//         taskName: 'list-1-name-5',
//         isDone: true
//       },
//     ]
//   },
// ]

// var fakeCountId = 2;

// const newFakeTodoListTemplate = fakeCountId => (
//   {
//     title: `list-${fakeCountId}`,
//     id: `${fakeCountId.toString}`,
//     tasks: [
//       {
//         id: `${fakeCountId}1`,
//         taskName: `list-${fakeCountId}-name-1`,
//         isDone: false
//       },
//       {
//         id: `${fakeCountId}2`,
//         taskName: `list-${fakeCountId}-name-2`,
//         isDone: true
//       },
//       {
//         id: `${fakeCountId}3`,
//         taskName: `list-${fakeCountId}-name-3`,
//         isDone: false
//       },
//       {
//         id: `${fakeCountId}4`,
//         taskName: `list-${fakeCountId}-name-4`,
//         isDone: false
//       },
//       {
//         id: `${fakeCountId}5`,
//         taskName: `list-${fakeCountId}-name-5`,
//         isDone: true
//       },
//     ]
//   }
// )

const Home = () => {

  const initalState = {
    showModal: '',
    haveInput: false,
    inputValue: '',
    modalTitle: '',
    idxList: -1,
    idxTask: -1,
  };

  const [data, setData] = useState([]);
  const [state, setState] = useState(initalState);

  useEffect(() => {
    api.get('api/lists').then(res => {
      console.log(res.data);
      setData(res.data);
    }).catch(err => {
      console.log(err);
      //setData(fakeTodoLists);
    })
  }, []);

  const toggleIsDoneHandle = async (listIdx, taskIdx) => {
    try {
      const listId = data[listIdx]._id;
      const idx = { taskIdx: taskIdx };
      await api.put(`/api/list/${listId}/task/is_done`, idx);
      const newData = [...data];
      newData[listIdx].tasks[taskIdx].isDone = !newData[listIdx].tasks[taskIdx].isDone;
      setData(newData);
    } catch (err) {
      console.log(err);
    }
  }

  const reorder = async (listIdx, startIdx, endIdx) => {
    try {
      const listId = data[listIdx]._id;
      const idx = { startIndex: startIdx, endIndex: endIdx };
      const res = await api.put(`/api/list/${listId}/task`, idx);
      const newData = [...data];
      newData[listIdx] = res.data;
      setData(newData); 
    } catch (err) {
      console.log(err);
    }
  };

  // both param are obj first field (index) is the idx of task and 
  // second field (droppableId) is the idx of list
  const move = async (droppableSource, droppableDestination) => {
    try {
      const listSourceIdx = Number(droppableSource.droppableId);
      const listDestIdx = Number(droppableDestination.droppableId);
      const listSourceId = data[listSourceIdx]._id;
      const listDestId = data[listDestIdx]._id;
      const idx = { sourceIdx:  droppableSource.index, destIdx: droppableDestination.index};
      const res = await api.put(`/api/list/${listSourceId}/${listDestId}/task`, idx);
      const newData = [...data];
      newData[listSourceIdx] = res.data[0];
      newData[listDestIdx] = res.data[1];
      setData(newData); 
    } catch (err) {
      console.log(err);
    }
  };

  const dataChangeHandle = (buttonType, idxList, idxTask) => {
    switch (buttonType) {
      case 'ADD_LIST':
        setState({
          ...state,
          showModal: 'ADD_LIST',
          haveInput: true,
          inputValue: '',
          modalTitle: 'Add new List',
          idxList: -1,
          idxTask: -1,
        });
        break;
      case 'ADD_TASK':
        setState({
          ...state,
          showModal: 'ADD_TASK',
          haveInput: true,
          inputValue: '',
          modalTitle: 'Add new Item',
          idxList: idxList,
          idxTask: -1,
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
          idxTask: -1,
        });
      break;
      case 'REMOVE_TASK':
        setState({
          ...state,
          showModal: 'REMOVE_TASK',
          haveInput: false,
          inputValue: '',
          modalTitle: 'Remove Item',
          idxList: idxList,
          idxTask: idxTask,
        });
        break;
      default:
        break;
    }
  }

  const onConfirmFunctionSelect = async e => {
    e.preventDefault();
    switch (state.showModal) {
      case 'ADD_LIST':
        const newList = {
          title: state.inputValue,
          tasks: [],
        }
        try {
          const res = await api.post('api/list', newList);
          setData([...data, res.data]);
        } catch (err) {
          console.log(err);
        }
        break;
      case 'ADD_TASK':
        const newTask = {
          taskName: state.inputValue,
          isDone: false,
        };
        const id = data[state.idxList]._id;
        const res = await api.put(`/api/list/${id}`, newTask);
        const newData = [...data];
        newData[state.idxList] = res.data;
        console.log('ADD_TASK', res.data);
        setData(newData);
        break;
      case 'REMOVE_LIST':
        try {
          const id = data[state.idxList]._id;
          await api.delete(`/api/list/${id}`);
          const _newData = [...data];
          _newData.splice(state.idxList, 1);
          setData(_newData);
        } catch (err) {
          console.log(err);
        }
      break;
      case 'REMOVE_TASK':
        const id_list = data[state.idxList]._id;
        const id_task = data[state.idxList].tasks[state.idxTask]._id;
        const _res = await api.put(`/api/list/${id_list}/${id_task}`);
        console.log(_res);
        const __newData = [...data];
        __newData[state.idxList] = res.data;
        setData(__newData);
        break;
      default:
        break;
    }
    setState(initalState);
  }

  const onDragEnd = async result => {
    const { source, destination, draggableId } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      if (source.index === destination.index)
        return;
      await reorder(sInd, source.index, destination.index);
    } else {
      await move(source, destination);
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
                  {TodoList.tasks.map((item, idxTask) => (
                    <Draggable
                      key={item._id}
                      draggableId={item._id}
                      index={idxTask}
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
                              onChange={() => toggleIsDoneHandle(idxList, idxTask)}  
                            />
                            <div style={{textDecoration: item.isDone ? 'line-through' : 'none'}}>
                            {item.taskName}
                            </div>
                            <button
                              type='button'
                              onClick={() => dataChangeHandle('REMOVE_TASK', idxList, idxTask)}
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
                      onClick={() => dataChangeHandle('ADD_TASK', idxList)}
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
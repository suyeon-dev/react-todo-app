import {
  faCheck,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { create, done } from '../store/modules/todo';
import { useEffect, useRef } from 'react';
import axios from 'axios';

export default function TodoList() {
  // useSelector(): store의 state 가져오기
  let todoList = useSelector((state) => state.todo.list);
  //   console.log(todoList); // 배열

  todoList = todoList.filter((todo) => todo.done === false);

  const nextID = useSelector((state) => state.todo.nextID);

  // useDispatch(): dispatch 함수 생성
  const dispatch = useDispatch();

  const inputRef = useRef();

  console.log('nextId:', nextID);

  // 할 일 추가 POST /todo
  const createTodo = async () => {
    if (inputRef.current.value.trim() === '') return;

    // dispatch: state를 변경해서 화면을 바꾸는 것
    dispatch(create({ id: todoList.length + 1, text: inputRef.current.value }));

    // db 정보를 바꾸기 위해서 axios 요청
    await axios.post(`${process.env.REACT_APP_API_SERVER}/todo`, {
      text: inputRef.current.value,
    });

    inputRef.current.value = '';
    inputRef.current.focus();
  };

  // todo 상태 변경 PATCH /todo/:todoId
  const toDone = async (id) => {
    // State를 변경해서 화면을 바꾸는 것
    dispatch(done(id));

    // DB 정보를 바꾸기 위해 axios 요청
    await axios.patch(`${process.env.REACT_APP_API_SERVER}/todo/${id}`);
  };

  const enterTodo = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') createTodo();
  };

  // 렌더링되자마자 Focus
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <section>
      <h3>할 일 목록</h3>
      <div>
        <input type='text' ref={inputRef} onKeyDown={enterTodo} />
        <button onClick={createTodo}>추가</button>
      </div>
      <ul>
        {todoList.map((el) => {
          return (
            <li key={el.id}>
              <span>{el.text}</span>

              {/* 완료 */}
              <button onClick={() => toDone(el.id)}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
              {/* 수정 */}
              <button>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              {/* 삭제 */}
              <button>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

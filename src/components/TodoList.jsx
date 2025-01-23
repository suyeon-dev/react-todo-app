import {
  faCheck,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { create, done } from '../store/modules/todo';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

// 스타일 나중에 분리
const TodoSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const TodoItem = styled.span`
  width: 150px;

  padding: 0.5rem;
`;

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

  const createTodo = () => {
    dispatch(create({ id: todoList.length + 1, text: inputRef.current.value }));
    inputRef.current.value = '';
    inputRef.current.focus();
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
    <TodoSection>
      <h3>할 일 목록</h3>
      <div>
        <input type='text' ref={inputRef} onKeyDown={enterTodo} />
        <button onClick={createTodo}>추가</button>
      </div>
      <ul>
        {todoList.map((el) => {
          return (
            <li key={el.id}>
              <spa>{el.text}</spa>

              {/* 완료 */}
              <button onClick={() => dispatch(done(el.id))}>
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
    </TodoSection>
  );
}

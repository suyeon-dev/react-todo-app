import {
  faCheck,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { create, done, del, update } from '../store/modules/todo';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ReduxState, Todo } from '../types/types';

export default function TodoList() {
  // useSelector(): store의 state 가져오기
  let todoList = useSelector((state: ReduxState) => state.todo.list);
  //   console.log(todoList); // 배열

  todoList = todoList.filter((todo: Todo) => todo.done === false);

  const nextID = useSelector((state: ReduxState) => state.todo.nextID);

  // useDispatch(): dispatch 함수 생성
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null); //태그에 접근

  console.log('nextId:', nextID);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  // 할 일 추가 POST /todo
  const createTodo = async () => {
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      // dispatch: state를 변경해서 화면을 바꾸는 것
      dispatch(create({ id: nextID, text: inputRef.current.value }));
    }

    // db 정보를 바꾸기 위해서 axios 요청
    await axios.post(`${process.env.REACT_APP_API_SERVER}/todo`, {
      text: inputRef.current?.value,
    });

    clearInput();
  };

  // todo 상태 변경 PATCH /todo/:todoId
  const toDone = async (id: number) => {
    // State를 변경해서 화면을 바꾸는 것
    dispatch(done(id));

    // DB 정보를 바꾸기 위해 axios 요청
    await axios.patch(`${process.env.REACT_APP_API_SERVER}/todo/${id}`);
  };

  const enterTodo = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') createTodo();
  };

  // 렌더링되자마자 Focus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // todo 삭제 // DELETE /todo/:todoId
  const deleteTodo = async (todoId: number) => {
    // 백엔드 요청
    await axios.delete(`${process.env.REACT_APP_API_SERVER}/todo/${todoId}`);

    // 프론트엔드 변경 (reducer의 내부 변경)
    // - reducer에 action 전달하는 Dispatch
    dispatch(del(todoId));
  };

  // todo 수정 // PATCH /api-server/content
  const [isUpdateMode, setIsUpdateMode] = useState(false); //수정 모드 관리
  const [updateId, setUpdateId] = useState(0); //수정

  const getTodo = (todoId: number) => {
    // 1. 수정모드로 변경하여 버튼 모양 변경
    // 2. 수정하고 싶은 text 값 Input value로 넣어주기

    // 수정 모드
    setIsUpdateMode(true); //수정모드로 변경

    // 백엔드와 통신 필요 없음. 배열을 이미 가지고 있으므로 객체값 뽑아오기
    const [todo] = todoList.filter((to) => to.id === todoId); //{} 새로운 배열 반환 filter
    console.log('todo', todo); // {id, text, done}

    if (inputRef.current) inputRef.current.value = todo.text;

    setUpdateId(todoId);
  };

  const cancelUpdate = () => {
    setIsUpdateMode(false);
    clearInput();
  };

  const updateTodo = async () => {
    // as string : Undefined여도 string으로 간주
    const inputValue = inputRef.current?.value as string;

    // DB 데이터 변경 , body로 보냄
    const res = await axios.patch(
      `${process.env.REACT_APP_API_SERVER}/content`,
      {
        id: updateId,
        text: inputValue,
      }
    );

    console.log(res.data); // 객체 {isSuccess}

    if (res.data.isSuccess) {
      cancelUpdate();
    }

    // 프론트엔드 반영
    // - dispatch 통해 action 보내야함 >> todo.ts 수정
    dispatch(update(updateId, inputValue));
  };

  return (
    <section>
      <h3>할 일 목록</h3>
      <div>
        <input type='text' ref={inputRef} onKeyDown={enterTodo} />
        {isUpdateMode ? (
          <>
            <button onClick={updateTodo}>수정</button>
            <button onClick={cancelUpdate}>수정 취소</button>
          </>
        ) : (
          <button onClick={createTodo}>추가</button>
        )}
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
              <button onClick={() => getTodo(el.id)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              {/* 삭제 */}
              <button onClick={() => deleteTodo(el.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

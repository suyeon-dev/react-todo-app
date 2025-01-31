import { Todo, TodoState } from '../../types/types';

const initialState: TodoState = {
  list: [
    // {
    //   id: 0,
    //   text: '리액트 공부하기',
    //   done: false, // 할 일 목록
    // },
    // {
    //   id: 1,
    //   text: '척추의 요정이 말합니다! 척추 펴기!',
    //   done: true, // 완료 목록
    // },
    // {
    //   id: 2,
    //   text: '운동하기',
    //   done: false,
    // },
  ],
};

const count = initialState.list.length; //3
initialState['nextID'] = count;

// action type에 대한 상수 설정
const CREATE = 'todo/CREATE' as const;
const DONE = 'todo/DONE' as const;
const INIT = 'todo/INIT' as const; // API 요청을 위한 action type
const DELETE = 'todo/DELETE' as const;
const UPDATE = 'todo/UPDATE' as const;

// ------------------- action 반환 함수 : 컴포넌트 내부에서 사용
export function create(payload: { id?: number; text: string }) {
  return {
    type: CREATE,
    payload: payload, // {id: number, text: string}
  };
}
export function done(id: number) {
  return {
    type: DONE,
    id: id, //id: number
  };
}

// data: {id, text, done}[]
// - 객체가 배열형태로 들어옴
export function init(data: Todo[]) {
  return {
    type: INIT,
    data: data,
  };
}

export function del(id: number) {
  return { type: DELETE, id: id };
}

export function update(id: number, text: string) {
  return {
    type: UPDATE,
    id,
    text,
  };
}

// ------------------- 액션의 인터페이스 만들기 -------------------
interface Init {
  // type: string;
  type: typeof INIT;
  data: Todo[];
}

interface Done {
  // type: string;
  type: typeof DONE;
  id: number;
}

interface Create {
  // type: string;
  type: typeof CREATE;
  payload: { id: number; text: string };
}

interface Delete {
  type: typeof DELETE;
  id: number;
}

interface Update {
  type: typeof UPDATE;
  id: number;
  text: string;
}

type Action = Create | Done | Init | Delete | Update;

// ------------------- reducer -------------------
// - state의 타입: 객체

export function todoReducer(state: TodoState = initialState, action: Action) {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        list: action.data,
        nextID:
          action.data.length === 0
            ? 1
            : action.data[action.data.length - 1].id + 1,
      };
    case CREATE:
      if (action.payload.text.trim() === '') return state;
      console.log('create 호출됨', action);
      return {
        // 기존 state 유지
        ...state,
        list: state.list.concat({
          id: action.payload.id,
          text: action.payload.text,
          done: false,
        }),
        nextID: action.payload.id + 1,
      };
    case DONE:
      console.log('done 호출됨', action);
      return {
        ...state,
        list: state.list.map((todo) => {
          console.log('in map todo', todo);

          // 바꾸고자 하는 조건
          if (todo.id === action.id) {
            return {
              ...todo, //done을 제외한 text, id 값을 유지시키기 위한 전개 연산
              done: true, //done 값 덮어쓰기
            };
          } else return todo;
        }),
      };
    case DELETE:
      // [{id:1}, {id:2}, {id:3}] >> [{id:1}, {id:3}]
      return {
        ...state,
        list: state.list.filter((todo: Todo) => todo.id !== action.id),
      };
    case UPDATE:
      return {
        ...state,
        list: state.list.map((li: Todo) => {
          if (li.id === action.id) {
            return {
              ...li,
              text: action.text,
            };
          }
          return li;
        }),
      };
    default:
      return state;
  }
}
// store/ index.js 에서 쓰기

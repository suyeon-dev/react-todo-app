const initialState = {
  list: [
    {
      id: 0,
      text: '리액트 공부하기',
      done: false, // 할 일 목록
    },
    {
      id: 1,
      text: '척추의 요정이 말합니다! 척추 펴기!',
      done: true, // 완료 목록
    },
    {
      id: 2,
      text: '운동하기',
      done: false,
    },
  ],
};

const count = initialState.list.length; //3
initialState['nexID'] = count;

// action type에 대한 상수 설정
const CREATE = 'todo/CREATE';
const DONE = 'todo/DONE';

// action 반환 함수 : 컴포넌트 내부에서 사용
export function create(payload) {
  return {
    type: CREATE,
    payload: payload, // {id: number, text: string}
  };
}
export function done(id) {
  return {
    type: DONE,
    id: id, //id: number
  };
}

// reducer
export function todoReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE:
      if (action.payload.text.trim === '') return state;
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
    default:
      return state;
  }
}
// store/ index.js 에서 쓰기

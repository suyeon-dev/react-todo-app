export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// 초기값
export interface TodoState {
  list: Todo[];
  nextID?: number;
}

// Redux
// - useSelector,
export interface ReduxState {
  todo: TodoState;

  // 상태 관리 추가 시 여기에 추가하기
}

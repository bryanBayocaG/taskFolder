export type ID = string | number;

export type Column = {
  id: ID;
  title: string;
  position: number;
};

export type Task = {
  id: ID;
  columnID: ID;
  content: string;
};

export type BackEndColumnData = {
  _id: ID;
  columnName: string;
  position: number;
  createdBy: string;
};

export type BackEndTaskData = {
  _id: ID;
  columnID: string;
  createdBy: string;
  content: string;
};

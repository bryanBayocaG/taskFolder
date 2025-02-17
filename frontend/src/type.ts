export type ID = string | number;

export type Column = {
  id: ID;
  title: string;
};

export type Task = {
  id: ID;
  columnID: ID;
  content: string;
};

export type BackEndColumnData = {
  _id: ID;
  columnName: string;
  createdBy: string;
};

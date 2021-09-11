import { Schema } from "express-validator";

const new_bedticket_schemea: Schema = {
  id: {
    in: "params",
  },
};

const new_entry_schema: Schema = {
  id: {
    in: "params",
  },
  type: {
    in: "body",
    isString: true,
  },
  note: {
    in: "body",
    isString: true,
    trim: true,
    optional: true,
  },
};

const read_entry_schema: Schema = {
  id: {
    in: "params",
  },
};

export { new_bedticket_schemea, new_entry_schema, read_entry_schema };
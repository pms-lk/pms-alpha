import { Router, Request, Response } from "express";
import { checkSchema } from "express-validator";

import {
  new_patient_schema,
  search_patient_schema,
} from "@pms-alpha/server/routes/schemas/patient.schema";
import {
  HandleNewPatient,
  HandlePatientBasicInfo,
  SearchPatientByName,
} from "@pms-alpha/server/controllers/patient.controller";

import { ValidateRequest } from "@pms-alpha/server/util/requestvalidate";

import { logger } from "@pms-alpha/shared";

import type { API } from "@pms-alpha/types";

const router = Router();

router.get("/:id/basic", async (req, res: Response<API.Response>) => {
  const pid = req.params.id;
  try {
    const { err, data } = await HandlePatientBasicInfo(pid);

    if (err) {
      res.status(400).json({ success: false, err });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    logger(`Error occured while fetching patient:${pid} basic info`, "error");
    console.log(error);
    res.sendStatus(500);
  }
});

router.post(
  "/add",
  checkSchema(new_patient_schema),
  ValidateRequest,
  async (req: Request, res: Response<API.Response>) => {
    try {
      const id = await HandleNewPatient(req.body);

      logger("New patient info saved", "success");
      res.status(200).json({ success: true, data: id });
    } catch (error) {
      logger("Error occured while saving patient info", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/search",
  checkSchema(search_patient_schema),
  ValidateRequest,
  async (req: Request, res: Response<API.Response>) => {
    try {
      const results = await SearchPatientByName(req.body.search);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      logger(`Error occured while searching ${req.body.search}`, "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;

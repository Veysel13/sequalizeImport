'use strict'

import { Request } from "express";
import { currentUser } from "../http/middlewares/current-user";
import { requireAuth } from "../http/middlewares/require-auth";
import { checkPermission } from "../http/middlewares/check-permission";
import { GraphqlNotAuthorizedError, graphqlRequireAuth, GraphqlValidationError } from "../graphql/graphql-error";

const requestIp = require('request-ip')
const validUrl = require('valid-url');

export const generateSmsCode = () => {
    let verificationCode
    if(process.env.ENVIRONMNET=='local')
        verificationCode = 111111
    else
        verificationCode = Math.floor(100000 + Math.random() * 900000)

    return verificationCode
}

export const employeeCode=()=> {

    let verificationCode = Math.floor(100 + Math.random() * 999)

    return verificationCode
}

export const getIP=(req:Request)=> {
    
  return  requestIp.getClientIp(req)
}

export const isValidUrl=(url:string)=> {
    if (validUrl.isUri(url) && (url.includes('http://') || url.includes('https://'))){
        return true;
    }else {
        return false;
    }
}

export const getRequestedFields = (info: any, parentType?: string): string[] => {
    const selections = info?.fieldNodes?.[0]?.selectionSet?.selections || [];
  
    const fields: string[] = [];
  
    selections.forEach((selection: any) => {
      const fieldName = selection.name.value;
  

      if (parentType === "Post" && fieldName === "user") return;
      if (parentType === "Post" && fieldName === "comments") return;
      if (parentType === "User" && fieldName === "posts") return;
  
      if (selection.selectionSet) {
        const subFields = getRequestedFields(
          { fieldNodes: [selection] },
          fieldName
        );
  
        subFields.forEach((subField) => fields.push(`${fieldName}.${subField}`));
      } else {
        fields.push(fieldName);
      }
    });
  
    return fields;
  };

export const withAuthAndPermission23 = async (req: any, res:any, permission?: string) => {
  await currentUser(req, req, () => {});
  await graphqlRequireAuth(req, res, () => {});
  if(permission){
    await checkPermission(permission);
  }
};

export const withAuthAndPermission = async (req: any, res: any, permission?: string) => {
  await currentUser(req, req, () => {});
  await graphqlRequireAuth(req, res, () => {});
  if (permission) {
    await checkPermission(permission);
  }
};

export const handleValidationForGraphql = (requestSchema:any, args: any) => {
  const { error } = requestSchema.validate(args);
  if (error) {
    throw new GraphqlValidationError(error.details[0].message);
  }
};
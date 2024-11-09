import { Request } from 'express';

interface RequestWithData extends Request {
    data?: any;
}

export default RequestWithData;
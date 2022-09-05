import MessageResponse from './MessageResponse'

export default interface DataResponse<T> extends MessageResponse {
  data: T | T[]
}

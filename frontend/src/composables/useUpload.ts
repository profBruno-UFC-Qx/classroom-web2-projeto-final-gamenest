import { BASE_URL } from '@/api'

function getUploadPath(path: string) {
  return `${BASE_URL}${path}`
}

export const useUpload = () => getUploadPath

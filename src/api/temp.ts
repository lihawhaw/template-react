export const tempApi = {
  async getName() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 0,
          data: '张三',
        })
      }, 1000)
    })
  },
}

const handleError = ({ output, err }) => {
  let v = {
    success: false
  }
  if (output) {
    v = { ...v, ...output }
  }
  if (err && err.message) {
    v = { ...v, msg: err.message }
  }
  console.log(v)
  return v
}

module.exports = {
  handleError
}
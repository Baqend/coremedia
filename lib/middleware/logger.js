export default function logger ({ getState }) {
  return next => action => {
    console.group(action.type)
    console.log('will dispatch', action)
    const result = next(action)
    console.log('state after dispatch', getState())
    console.groupEnd()

    return result
  }
}

import {useAsyncStorage as useAS} from '@react-native-async-storage/async-storage';

const useAsyncStorage = <T, U = T extends undefined ? string : T>(
  key: string,
  defaultValue?: T,
) => {
  const {getItem: _getItem, ...rest} = useAS(key);

  const getItem = async () => {
    const result = await _getItem();

    if (result === null) return defaultValue ?? null;

    try {
      const parsed = JSON.parse(result);

      return parsed as U;
    } catch {
      return result as U;
    }
  };

  return {
    getItem,
    ...rest,
  };
};

export default useAsyncStorage;

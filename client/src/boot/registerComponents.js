import Injector from 'lib/Injector';
import CKANResourceLocator from 'components/CKANResourceLocator';
import ResultConditions from 'components/ResultConditions';

export default () => {
  Injector.component.registerMany({
    CKANResourceLocator,
    ResultConditions,
  });
};

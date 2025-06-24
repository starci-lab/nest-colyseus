const authRoot = 'auth';

/**
 * Tạo các route cơ bản (GET one, UPDATE, DELETE) theo root truyền vào.
 * @param root - Đường dẫn gốc của resource (ví dụ: 'human/get-salary')
 * @returns Object chứa các route chuẩn REST
 */
const baseRoutes = (root: string) => {
  return {
    root,
    getOne: `/${root}/:id`,
    update: `/${root}/:id`,
    delete: `/${root}/:id`,
  };
};

const v1 = 'v1';

export const routesV1 = {
  version: v1,
  // #region AUTH
  auth: {
    root: authRoot,
    message: `/${authRoot}/message`,
    verify: `/${authRoot}/verify`,
    refreshToken: `${authRoot}/refresh-token`,
    logout: `${authRoot}/logout`,
  },
  //#endregion
};

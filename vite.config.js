import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        // 仅注入 uView Plus 主题变量，不引用 uni.scss 避免循环
        additionalData: `
          $u-primary: #4A90D9;
          $u-success: #52C41A;
          $u-warning: #FAAD14;
          $u-error: #FF4D4F;
          $u-info: #909399;
          @import "uview-plus/theme.scss";
        `,
      },
    },
  },
})

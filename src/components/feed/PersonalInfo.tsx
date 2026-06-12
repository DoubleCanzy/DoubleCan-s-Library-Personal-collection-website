export default function PersonalInfo() {
  return (
    <div className="border border-black p-4">
      {/* 头像 */}
      <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center bg-gray-200 text-2xl text-gray-500">
        ?
      </div>

      {/* 昵称 */}
      <h2 className="text-center text-lg font-semibold">
        DoubleCan
      </h2>

      {/* 简介 */}
      <p className="mt-1 text-center text-sm text-gray-500">
        一个热爱故事的人。
        <br />
        记录看过的每一部作品。
      </p>

      {/* 所在地 + 邮箱 */}
      <div className="mt-4 space-y-1 text-xs text-gray-400 text-center">
        <p>📍 Earth</p>
        <p>✉️ doublecan@library.dev</p>
      </div>
    </div>
  );
}

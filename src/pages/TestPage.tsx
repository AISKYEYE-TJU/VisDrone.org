import React from 'react';
import { Link } from 'react-router-dom';

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-black">测试页面</h1>
      <p className="text-gray-600 mb-8">这是一个测试页面</p>
      <div className="mt-4">
        <Link to="/team" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          返回团队页面
        </Link>
      </div>
    </div>
  );
}
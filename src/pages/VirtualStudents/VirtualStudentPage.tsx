import React from 'react';
import { useParams } from 'react-router-dom';
import VirtualStudentAgent from '@/components/VirtualStudentAgent';
import { teamMembers } from '@/data/index';

export default function VirtualStudentPage() {
  const { studentId } = useParams<{ studentId: string }>();
  
  // 找到对应的虚拟学生
  const student = teamMembers.find(member => member.id === studentId);
  
  if (!student) {
    return <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">学生不存在</h1>
      <p className="text-muted-foreground">找不到指定的虚拟学生信息</p>
    </div>;
  }
  
  return <VirtualStudentAgent student={student} />;
}
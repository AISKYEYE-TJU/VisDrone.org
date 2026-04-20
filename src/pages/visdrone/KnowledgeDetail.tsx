﻿﻿﻿import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const KnowledgeDetail: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="container mx-auto px-4 py-12 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-4">知识详情</h1>
        <p className="text-muted-foreground">知识 ID: {id}</p>
      </motion.div>
    </div>
  );
};

export default KnowledgeDetail;

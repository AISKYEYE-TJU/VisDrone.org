﻿﻿﻿import React from 'react';
import { motion } from 'framer-motion';

const AdminV2: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-4">管理后台 V2</h1>
        <p className="text-muted-foreground">后台管理功能</p>
      </motion.div>
    </div>
  );
};

export default AdminV2;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Zhaotianjiao() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 艺术化头部 - 灵感来自设计学院网站 */}
      <div className="relative h-[500px] overflow-hidden">
        {/* 抽象艺术背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          {/* 几何装饰图案 */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4"
            >
              <div className="text-sm md:text-base tracking-[0.3em] uppercase opacity-90 mb-2">Associate Professor</div>
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-wide">赵天娇</h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"
            ></motion.div>
            <p className="text-2xl md:text-3xl mb-8 font-light tracking-wide">人机协同设计实验室 创始人</p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a 
                href="mailto:zhaotianjiao@seu.edu.cn" 
                className="px-8 py-3 border-2 border-white/60 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-indigo-900 transition-all duration-300 font-medium tracking-wide"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  联系邮箱
                </span>
              </motion.a>
              <Link to="/team">
                <motion.div 
                  className="px-8 py-3 bg-white text-indigo-900 rounded-full hover:bg-white/90 transition-all duration-300 font-medium tracking-wide shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回团队
                  </span>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* 个人简介 - 卡片式设计 */}
        <motion.section 
          className="mb-20 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-indigo-400 rounded-tl-3xl"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-pink-400 rounded-br-3xl"></div>
          <div className="bg-white p-10 rounded-2xl shadow-xl">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <motion.div 
                className="md:w-1/4 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-2xl transform rotate-3 scale-105"></div>
                <img 
                  src="/photoztj.jpg" 
                  alt="赵天娇教授" 
                  className="w-full h-auto rounded-2xl shadow-2xl relative z-10"
                />
              </motion.div>
              <div className="md:w-3/4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-pink-500 mr-4 rounded-full"></div>
                    <h2 className="text-4xl font-bold text-gray-800">个人简介</h2>
                  </div>
                  <p className="text-gray-700 leading-loose text-lg text-justify">
                    人机协同设计实验室创始人，香港理工大学设计学院博士，兼职博导。曾获北洋学者，青年骨干教师称号，天津市"131"创新型人才培养工程第三层次人选。发表 SCI，CSSCI，EI 等学术论文 30 余篇，主持国家自然科学基金青年项目、面上项目，主持参与教育部产学协同育人及人文社科项目多项，出版教材专著 3 部，获天津大学青年教师讲课大赛二等奖，全国高校数字艺术设计大赛优秀指导教师，多次指导学生获得设计奖项。
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 联系方式 - 现代卡片布局 */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="flex items-center mb-8">
            <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-pink-500 mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">联系方式</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -8 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">电子邮箱</h3>
                <a href="mailto:zhaotianjiao@seu.edu.cn" className="text-gray-600 hover:text-indigo-600 transition-colors">zhaotianjiao@seu.edu.cn</a>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -8 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-100 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">联系电话</h3>
                <p className="text-gray-600">18222863021</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -8 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">工作单位</h3>
                <p className="text-gray-600">人机协同设计实验室</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 教育背景 - 时间轴设计 */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex items-center mb-10">
            <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-pink-500 mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">教育背景</h2>
          </div>
          <div className="relative">
            {/* 时间轴线 */}
            <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 transform md:-translate-x-1/2"></div>
            
            <div className="space-y-12">
              {[
                { time: '2005.09-2009.07', school: '哈尔滨工业大学 机电工程学院', degree: '工业设计 学士', color: 'indigo' },
                { time: '2009.09-2011.07', school: '哈尔滨工业大学 机电工程学院', degree: '机械设计及理论 硕士', color: 'purple' },
                { time: '2011.09-2015.03', school: '香港理工大学 设计学院', degree: '设计学 博士', color: 'pink' },
                { time: '2013.12-2014.03', school: '台湾大学 建筑与城乡研究所', degree: '设计学 访问学人', color: 'rose' },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="md:w-1/2"></div>
                  <div className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-${item.color}-500 border-4 border-white shadow-lg transform -translate-x-1/2 z-10`}></div>
                  <motion.div 
                    className="md:w-1/2 md:px-8 w-full"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 border-${item.color}-500 ml-8 md:ml-0`}>
                      <div className={`text-${item.color}-600 font-bold mb-2`}>{item.time}</div>
                      <div className="text-gray-800 font-semibold mb-1">{item.school}</div>
                      <div className="text-gray-600">{item.degree}</div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 工作经历 - 卡片网格 */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="flex items-center mb-10">
            <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-pink-500 mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">工作经历</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { time: '2016.04-2020.12', position: '讲师', institution: '天津大学 软件学院 视觉艺术系', color: 'from-blue-500 to-cyan-500' },
              { time: '2020.12-2025.09', position: '副教授', institution: '天津大学 软件学院 视觉艺术系', color: 'from-indigo-500 to-purple-500' },
              { time: '2025.09-至今', position: '创始人', institution: '人机协同设计实验室', color: 'from-pink-500 to-rose-500' },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}></div>
                <div className={`absolute -right-12 -bottom-12 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative z-10">
                  <div className={`text-sm font-medium bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-3`}>{item.time}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.position}</h3>
                  <p className="text-gray-600 text-sm">{item.institution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 研究领域 - 创意卡片 */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="flex items-center mb-10">
            <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-pink-500 mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">研究领域</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '设计创新教育',
                desc: '研究设计教育的创新方法，培养具有创造力和技术能力的设计人才。',
                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                gradient: 'from-blue-400 to-indigo-500',
                bg: 'from-blue-50 to-indigo-50'
              },
              {
                title: '群智创新设计',
                desc: '研究集体智慧在设计过程中的应用，构建协作式设计系统。',
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                gradient: 'from-purple-400 to-pink-500',
                bg: 'from-purple-50 to-pink-50'
              },
              {
                title: '人机交互设计',
                desc: '研究多模态交互界面设计，探索自然语言与视觉交互的融合技术。',
                icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                gradient: 'from-cyan-400 to-blue-500',
                bg: 'from-cyan-50 to-blue-50'
              },
              {
                title: '生成式设计',
                desc: '探索人工智能与设计创新的结合，利用先进技术推动设计领域的发展。',
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                gradient: 'from-pink-400 to-rose-500',
                bg: 'from-pink-50 to-rose-50'
              }
            ].map((area, index) => (
              <motion.div 
                key={index}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br ${area.bg} shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${area.gradient} opacity-10 rounded-full transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500`}></div>
                <div className={`w-16 h-16 bg-gradient-to-br ${area.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={area.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{area.title}</h3>
                <p className="text-gray-600 leading-relaxed">{area.desc}</p>
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${area.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 讲课经历 - 艺术化表格 */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="flex items-center mb-10">
            <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-pink-500 mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">讲课经历</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
              <div className="md:col-span-3 font-semibold">课程名称</div>
              <div className="font-semibold">课时</div>
              <div className="font-semibold">时间范围</div>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { course: '动漫衍生品设计', hours: '32 课时', time: '2018-2023' },
                { course: '用户体验设计', hours: '32 课时', time: '2018-2025' },
                { course: '设计思维', hours: '16 课时', time: '2019-2023' },
                { course: '展示设计', hours: '32 课时', time: '2023-2024' },
                { course: '产品形态设计基础', hours: '32 课时', time: '2017-2018' }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="md:col-span-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-800">{item.course}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.hours}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 所获荣誉 - 奖章式设计 */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="flex items-center mb-10">
            <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-pink-500 mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">所获荣誉</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '北洋学者·青年骨干教师', icon: '🎓', color: 'from-amber-400 to-orange-500' },
              { title: '天津"131 人才工程"第三层次', icon: '⭐', color: 'from-yellow-400 to-amber-500' },
              { title: '天津大学青年教师讲课大赛 二等奖', icon: '🏆', color: 'from-gray-300 to-gray-400' },
              { title: '全国高校数字艺术设计大赛 优秀指导教师', icon: '🎨', color: 'from-pink-400 to-rose-500' },
              { title: '海棠筑梦人 教学志愿者', icon: '🌸', color: 'from-pink-300 to-pink-400' }
            ].map((honor, index) => (
              <motion.div 
                key={index}
                className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${honor.color} opacity-20 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="flex items-start">
                  <div className={`w-14 h-14 bg-gradient-to-br ${honor.color} rounded-2xl flex items-center justify-center text-2xl mr-4 shadow-md group-hover:rotate-12 transition-transform duration-300`}>
                    {honor.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{honor.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 校园服务 - 列表设计 */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <div className="flex items-center mb-10">
            <div className="w-1 h-10 bg-gradient-to-b from-indigo-500 to-pink-500 mr-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">校园服务</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                '天津大学 VI 平面社学生社团 负责教师',
                '天津大学庆祝建党百年视觉艺术展 展览负责人',
                '大创项目（市级）《多学科融合设计年展创意策划与实践》指导教师',
                '大创项目（校级）《天津非物质文化遗产的数字化保护》指导教师',
                '天津市大学生工业与艺术设计竞赛一等奖《喜谱 - 国潮文创设计》指导教师',
                '天津市大学生工业与艺术设计竞赛二等奖《云盒 - 校园智能打印服务设计》指导教师',
                '全国高校数字艺术设计大赛天津市一等奖《人工智能人脸生成在设计》指导教师',
                '全国高校数字艺术设计大赛天津市一等奖《养食·老年人膳食服务 APP》指导教师',
                '全国高校数字艺术设计大赛天津市三等奖《原宝儿 - 表情包设计》指导教师',
                '天津市原创动漫大赛三等奖《永恒的印记》指导教师',
                '天津大学扶贫项目--宕昌冰雪节吉祥物设计 指导教师'
              ].map((service, index) => (
                <motion.div 
                  key={index}
                  className="group flex items-start p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-all duration-300"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 group-hover:text-gray-900">{service}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 返回按钮 */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full blur opacity-75 animate-pulse"></div>
            <Link to="/team">
              <motion.div 
                className="relative px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full hover:shadow-2xl transition-all duration-300 inline-flex items-center font-medium tracking-wide cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回团队页面
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 艺术化页脚 */}
      <footer className="relative mt-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-2xl font-bold mb-4 tracking-wide">赵天娇</div>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-300 mb-2">人机协同设计实验室 创始人</p>
            <p className="text-gray-400 text-sm">智能创新设计与设计教育研究</p>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-500 text-sm">© 2026 CHI LAB</p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

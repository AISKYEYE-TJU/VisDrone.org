import os
import re
import shutil

source_dir = r"d:\TRAEProjects\VisDrone\成员 – VISDRONE_files"
target_dir = r"d:\TRAEProjects\VisDrone\public\team"

os.makedirs(target_dir, exist_ok=True)

image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.webp')

files = os.listdir(source_dir)

name_to_file = {}

special_mapping = {
    '微信图片_20231223203439-scaled.jpg': '朱鹏飞',
    'WechatIMG221-q7z54jzom0zqzqglf4vr1yk65mt2qxpxknsjmvcj34.jpeg': '李佳璐',
    'zhuwencheng-qdqp2sliqwcnvr4pcn9nk7kbxw5oacbnmqc3e8u7q8-1.png': '朱文成',
    'zwx-qwvv7kk00llhztgjdj98cou1oqnra9kpdxe236isgw-1.jpg': '赵文希',
    'lhy-qwu8qw5l78g9samd7ry5bsq5lcck4e5eoqmlmr5cps.jpg': '李赫扬',
    'xzy-qwu8olfshtb1elyims6z8dllbfo9b1111d7veejzxc.jpg': '徐志雨',
    'wzx-qwu8ncbjdrl9xbs1y8ovwozgsxun1k1wv5wkd4ew80.jpg': '王志翔',
    'ykx-scaled-qwu8i83668l2pr7nu120bzh4df2p4vqitu1eaw023k.jpg': '姚可心',
    'zyy-qypu27y7klbsl7pko2foteuxmeev7rept5lv6yr34w.jpg': '张月潆',
    'zhangshnegli-qm77l3a7gkutrpjzswp8s2yrqh2sgfn9ccaylawrs0.png': '张胜利',
    'liranxin-qdxlrqqwdi9hf8h1f3vhbgqawe7osrwq7pntmk7o9s.jpg': '李冉新',
    'gyk-scaled.jpg': '高祎珂',
    'zhuruixuan-scaled-qpces5tpwjrxrdcljuhev2b418lln4jp0x87wqvh5s.jpg': '朱芮萱',
    'wjh-scaled-r4plezz1y0khev49cwztsknsoxgzs1e9nb4p7eb0rk.jpg': '武嘉和',
    'taoboan-qgn1si5k6221xr01r4av9xoopozevbjcn1nrrylvvk.jpg': '陶柏安',
    'liweihao-qpds2yr691cjhfcjy0jxu75f2kthh0e71dv77bcskg.jpg': '李维浩',
    'gaoxiyuan-scaled-qp0ek3equj7tif7rex742lccqe6ukm5qdqosc5xvhc-1.jpg': '高西远',
    'yaoxinjie_2-scaled-qhpsdcnojgphthnqpfvhdx0wsjojbzauhyvuabdoyo.jpg': '姚鑫杰',
}

all_names = set()

for f in files:
    if not f.lower().endswith(image_extensions):
        continue
    
    name = None
    
    if f in special_mapping:
        name = special_mapping[f]
    else:
        match = re.match(r'^(\d+_)?([^_]+)_([^_]+)_(\d+)', f)
        if match:
            name = match.group(2)
        
        if not name:
            match = re.match(r'^(\d{4})-([^-]+)', f)
            if match:
                name = match.group(2)
        
        if not name:
            chinese_matches = re.findall(r'[\u4e00-\u9fff]+', f)
            if chinese_matches:
                name = chinese_matches[0]
    
    if name:
        name = name.strip()
        all_names.add(name)
        
        ext = os.path.splitext(f)[1]
        target_name = f"{name}{ext}"
        source_path = os.path.join(source_dir, f)
        target_path = os.path.join(target_dir, target_name)
        
        if os.path.exists(target_path):
            existing_size = os.path.getsize(target_path)
            new_size = os.path.getsize(source_path)
            if new_size > existing_size:
                shutil.copy2(source_path, target_path)
                name_to_file[name] = target_name
                print(f"Updated: {f} -> {target_name}")
        else:
            shutil.copy2(source_path, target_path)
            name_to_file[name] = target_name
            print(f"Copied: {f} -> {target_name}")

print(f"\n{'='*60}")
print(f"Total unique names: {len(all_names)}")
print(f"{'='*60}")

print("\nAll names found:")
for name in sorted(all_names):
    print(f"  {name}")

import requests
import json
import time
import sys

def fetch_crossref_pdf(title, authors, year=None):
    """Query Crossref API to get PDF link for a paper"""
    try:
        query = requests.utils.quote(title)
        url = f"https://api.crossref.org/works?query={query}&rows=1"

        headers = {
            'User-Agent': 'VisDrone-Research/1.0 (mailto:visdrone@tju.edu.cn)'
        }

        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code != 200:
            return None

        data = response.json()
        items = data.get('message', {}).get('items', [])

        if not items:
            return None

        work = items[0]
        pdf_url = None

        # Try DOI first
        if work.get('DOI'):
            # Check if it's from a known open access publisher
            doi = work['DOI']
            publisher = work.get('publisher', '').lower()

            # AAAI, NeurIPS, OpenReview
            if 'aaai' in publisher or 'ojs.aaai' in str(work.get('URL', '')):
                pdf_url = f"https://doi.org/{doi}"
            # IEEE
            elif 'ieee' in publisher or '10.1109' in doi:
                pdf_url = f"https://doi.org/{doi}"
            # Springer
            elif 'springer' in publisher:
                pdf_url = f"https://link.springer.com/content/pdf/10.{work.get('DOI', '').split('.')[-1]}.pdf"
            # CVPR/Openaccess
            elif 'cvpr' in str(work.get('URL', '')).lower() or 'openaccess.thecvf' in str(work.get('URL', '')).lower():
                pdf_url = f"https://openaccess.thecvf.com/{work['URL'].split('/')[-1]}" if work.get('URL') else f"https://doi.org/{doi}"
            else:
                pdf_url = f"https://doi.org/{doi}"

        return pdf_url

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return None

def main():
    # Load papers without PDF
    papers = [
        {"id": "paper-37", "title": "Every Node is Different: Dynamically Fusing Self-Supervised Tasks for Attributed Graph Clustering"},
        {"id": "paper-38", "title": "Exploring Diverse Representations for Open Set Recognition"},
        {"id": "paper-39", "title": "Dynamic Sub-graph Distillation for Robust Semi-supervised Continual Learning"},
        {"id": "paper-40", "title": "Boosting Pseudo-Labeling With Curriculum Self-Reflection for Attributed Graph Clustering"},
        {"id": "paper-41", "title": "CCP-GNN: Competitive Covariance Pooling for Improving Graph Neural Networks"},
        {"id": "paper-42", "title": "Multi-modal Gated Mixture of Local-to-Global Experts for Dynamic Image Fusion"},
        {"id": "paper-43", "title": "Towards A Deeper Understanding of Global Covariance Pooling in Deep Learning: An Optimization Perspective"},
        {"id": "paper-44", "title": "Cross-Drone Transformer Network for Robust Single Object Tracking"},
        {"id": "paper-45", "title": "Multi-Task Credible Pseudo-Label Learning for Semi-supervised Crowd Counting"},
        {"id": "paper-46", "title": "OpenMix+: Revisiting Data Augmentation for Open Set Recognition"},
        {"id": "paper-47", "title": "Autoencoder-based Collaborative Attention GAN for Multi-modal Image Synthesis"},
        {"id": "paper-48", "title": "Robust Multi-Drone Multi-Target Tracking to Resolve Target Occlusion: A Benchmark"},
        {"id": "paper-49", "title": "Tuning Pre-trained Model via Moment Probing"},
        {"id": "paper-50", "title": "Multi-view Knowledge Ensemble with Frequency Consistency for Face Cross-Domain Translation"},
        {"id": "paper-55", "title": "Semi-supervised Image Deraining Using Knowledge Distillation"},
        {"id": "paper-56", "title": "Collaborative Decision-Reinforced Self-Supervision for Attributed Graph Clustering"},
        {"id": "paper-57", "title": "Learning Self-supervised Low-Rank Network for Single-Stage Weakly and Semi-supervised Semantic Segmentation"},
        {"id": "paper-58", "title": "Drone-Based RGB-Infrared Cross-Modality Vehicle Detection via Uncertainty-Aware Learning"},
        {"id": "paper-59", "title": "Confidence-aware Fusion using Dempster-Shafer Theory for Multispectral Pedestrian Detection"},
        {"id": "paper-61", "title": "Latent Heterogeneous Graph Network for Incomplete Multi-View Learning"},
        {"id": "paper-62", "title": "Detection and Tracking Meet Drones Challenge"},
        {"id": "paper-63", "title": "Graph Regularized Flow Attention Network for Video Animal Counting From Drones"},
        {"id": "paper-64", "title": "Dynamic Hybrid Relation Network for Cross-Domain Context-Dependent Semantic Parsing"},
        {"id": "paper-65", "title": "Multi-View Information-Bottleneck Representation Learning"},
        {"id": "paper-66", "title": "Evolving Fully Automated Machine Learning via Life-Long Knowledge Anchors"},
        {"id": "paper-68", "title": "Latent Multi-view Subspace Clustering"},
        {"id": "paper-69", "title": "Adaptive and Robust Partition Learning for Person Retrieval With Policy Gradient"},
        {"id": "paper-70", "title": "Multi-Drone-Based Single Object Tracking With Agent Sharing Network"},
        {"id": "paper-71", "title": "SPL-MLL: Selecting Predictable Landmarks for Multi-Label Learning"},
        {"id": "paper-72", "title": "Spatial Attention Pyramid Network for Unsupervised Domain Adaptation"},
        {"id": "paper-73", "title": "Semisupervised Laplace-Regularized Multimodality Metric Learning"},
        {"id": "paper-74", "title": "Single Image Deraining Using Bilateral Recurrent Network"},
        {"id": "paper-75", "title": "Collaborative Graph Convolutional Networks: Unsupervised Learning Meets Semi-Supervised Learning"},
        {"id": "paper-53", "title": "DetFusion: A Detection-driven Infrared and Visible Image Fusion Network"},
        {"id": "paper-54", "title": "Self-Supervised Fully Automatic Learning Machine for Intelligent Retail Container"},
        {"id": "paper-79", "title": "Hybrid Noise-Oriented Multilabel Learning"},
        {"id": "paper-80", "title": "Flexible Multi-View Representation Learning for Subspace Clustering"},
        {"id": "paper-81", "title": "Deep Fuzzy Tree for Large-Scale Hierarchical Visual Classification"},
        {"id": "paper-82", "title": "Fuzzy Rough Set Based Feature Selection for Large-Scale Hierarchical Classification"},
        {"id": "paper-85", "title": "Latent Semantic Aware Multi-View Multi-Label Classification"},
        {"id": "paper-86", "title": "FISH-MML: Fisher-HSIC Multi-View Metric Learning"},
        {"id": "paper-87", "title": "Beyond Similar and Dissimilar Relations: A Kernel Regression Formulation for Metric Learning"},
        {"id": "paper-88", "title": "Towards Generalized and Efficient Metric Learning on Riemannian Manifold"},
        {"id": "paper-89", "title": "Flexible Multi-View Dimensionality Co-Reduction"},
        {"id": "paper-90", "title": "Hierarchical Feature Selection with Recursive Regularization"},
        {"id": "paper-91", "title": "Data-Distribution-Aware Fuzzy Rough Set Model and its Application to Robust Classification"},
        {"id": "paper-93", "title": "Coupled Dictionary Learning for Unsupervised Feature Selection"},
        {"id": "paper-94", "title": "From Point to Set: Extend the Learning of Distance Metrics"},
        {"id": "paper-95", "title": "Multi-scale Patch Based Collaborative Representation for Face Recognition with Margin Distribution Optimization"},
        {"id": "paper-96", "title": "A Linear Subspace Learning Approach via Sparse Coding"},
        {"id": "paper-97", "title": "A Novel Algorithm for Finding Reducts With Fuzzy Rough Sets"},
        {"id": "paper-51", "title": "Stabilizing Multispectral Pedestrian Detection with Evidential Hybrid Fusion"},
        {"id": "paper-77", "title": "Unsupervised spectral feature selection with dynamic hyper-graph learning"},
        {"id": "paper-78", "title": "A Recursive Regularization Based Feature Selection Framework for Hierarchical Classification"},
        {"id": "paper-52", "title": "Learning Dynamic Compact Memory Embedding for Deformable Visual Object Tracking"},
        {"id": "paper-76", "title": "ECA-Net: Efficient Channel Attention for Deep Convolutional Neural Networks"},
    ]

    print(f"Total papers to process: {len(papers)}", file=sys.stderr)

    results = []
    for i, paper in enumerate(papers):
        title = paper['title']
        print(f"[{i+1}/{len(papers)}] {title[:60]}...", file=sys.stderr)

        pdf_url = fetch_crossref_pdf(title, None)

        if pdf_url:
            print(f"  Found: {pdf_url}", file=sys.stderr)
            results.append({'id': paper['id'], 'title': title, 'pdf_url': pdf_url, 'status': 'success'})
        else:
            print(f"  Not found", file=sys.stderr)
            results.append({'id': paper['id'], 'title': title, 'pdf_url': None, 'status': 'not_found'})

        time.sleep(0.3)  # Rate limiting

    # Save results
    with open('src/data/crossref_results_batch2.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    success_count = len([r for r in results if r['status'] == 'success'])
    print(f"\nDone! Success: {success_count}/{len(papers)}", file=sys.stderr)
    print(f"Results saved to src/data/crossref_results_batch2.json", file=sys.stderr)

if __name__ == "__main__":
    main()

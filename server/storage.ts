import {
  users, concepts, theoryContent, codeImplementations, experiments, papers,
  type User, type InsertUser,
  type Concept, type InsertConcept,
  type TheoryContent, type InsertTheoryContent,
  type CodeImplementation, type InsertCodeImplementation,
  type Experiment, type InsertExperiment,
  type Paper, type InsertPaper
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Concept methods
  getAllConcepts(): Promise<Concept[]>;
  getConceptById(id: number): Promise<Concept | undefined>;
  getConceptBySlug(slug: string): Promise<Concept | undefined>;
  createConcept(concept: InsertConcept): Promise<Concept>;
  getConceptsByCategory(category: string): Promise<Concept[]>;

  // Theory content methods
  getTheoryByConceptId(conceptId: number): Promise<TheoryContent | undefined>;
  createTheoryContent(content: InsertTheoryContent): Promise<TheoryContent>;

  // Code implementation methods
  getCodeImplementationsByConceptId(conceptId: number): Promise<CodeImplementation[]>;
  createCodeImplementation(implementation: InsertCodeImplementation): Promise<CodeImplementation>;

  // Experiment methods
  getExperimentsByConceptId(conceptId: number): Promise<Experiment[]>;
  createExperiment(experiment: InsertExperiment): Promise<Experiment>;

  // Paper methods
  getAllPapers(): Promise<Paper[]>;
  getPaperById(id: number): Promise<Paper | undefined>;
  createPaper(paper: InsertPaper): Promise<Paper>;
  getRelatedPapersByConcepts(conceptIds: string[]): Promise<Paper[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private concepts: Map<number, Concept>;
  private theoryContents: Map<number, TheoryContent>;
  private codeImplementations: Map<number, CodeImplementation>;
  private experiments: Map<number, Experiment>;
  private papers: Map<number, Paper>;
  
  private userId: number;
  private conceptId: number;
  private theoryContentId: number;
  private codeImplementationId: number;
  private experimentId: number;
  private paperId: number;

  constructor() {
    this.users = new Map();
    this.concepts = new Map();
    this.theoryContents = new Map();
    this.codeImplementations = new Map();
    this.experiments = new Map();
    this.papers = new Map();
    
    this.userId = 1;
    this.conceptId = 1;
    this.theoryContentId = 1;
    this.codeImplementationId = 1;
    this.experimentId = 1;
    this.paperId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Concept methods
  async getAllConcepts(): Promise<Concept[]> {
    return Array.from(this.concepts.values());
  }

  async getConceptById(id: number): Promise<Concept | undefined> {
    return this.concepts.get(id);
  }

  async getConceptBySlug(slug: string): Promise<Concept | undefined> {
    return Array.from(this.concepts.values()).find(
      (concept) => concept.slug === slug,
    );
  }

  async createConcept(insertConcept: InsertConcept): Promise<Concept> {
    const id = this.conceptId++;
    const now = new Date();
    const concept: Concept = { ...insertConcept, id, updatedAt: now };
    this.concepts.set(id, concept);
    return concept;
  }

  async getConceptsByCategory(category: string): Promise<Concept[]> {
    return Array.from(this.concepts.values()).filter(
      (concept) => concept.category === category,
    );
  }

  // Theory content methods
  async getTheoryByConceptId(conceptId: number): Promise<TheoryContent | undefined> {
    return Array.from(this.theoryContents.values()).find(
      (content) => content.conceptId === conceptId,
    );
  }

  async createTheoryContent(insertContent: InsertTheoryContent): Promise<TheoryContent> {
    const id = this.theoryContentId++;
    const now = new Date();
    const content: TheoryContent = { ...insertContent, id, updatedAt: now };
    this.theoryContents.set(id, content);
    return content;
  }

  // Code implementation methods
  async getCodeImplementationsByConceptId(conceptId: number): Promise<CodeImplementation[]> {
    return Array.from(this.codeImplementations.values()).filter(
      (implementation) => implementation.conceptId === conceptId,
    );
  }

  async createCodeImplementation(insertImplementation: InsertCodeImplementation): Promise<CodeImplementation> {
    const id = this.codeImplementationId++;
    const now = new Date();
    const implementation: CodeImplementation = { ...insertImplementation, id, updatedAt: now };
    this.codeImplementations.set(id, implementation);
    return implementation;
  }

  // Experiment methods
  async getExperimentsByConceptId(conceptId: number): Promise<Experiment[]> {
    return Array.from(this.experiments.values()).filter(
      (experiment) => experiment.conceptId === conceptId,
    );
  }

  async createExperiment(insertExperiment: InsertExperiment): Promise<Experiment> {
    const id = this.experimentId++;
    const now = new Date();
    const experiment: Experiment = { ...insertExperiment, id, updatedAt: now };
    this.experiments.set(id, experiment);
    return experiment;
  }

  // Paper methods
  async getAllPapers(): Promise<Paper[]> {
    return Array.from(this.papers.values());
  }

  async getPaperById(id: number): Promise<Paper | undefined> {
    return this.papers.get(id);
  }

  async createPaper(insertPaper: InsertPaper): Promise<Paper> {
    const id = this.paperId++;
    const now = new Date();
    const paper: Paper = { ...insertPaper, id, updatedAt: now };
    this.papers.set(id, paper);
    return paper;
  }

  async getRelatedPapersByConcepts(conceptTags: string[]): Promise<Paper[]> {
    return Array.from(this.papers.values()).filter(paper => 
      paper.concepts && paper.concepts.some(concept => conceptTags.includes(concept))
    );
  }

  // Initialize sample data
  private initSampleData() {
    // Create sample concepts
    const semiSupervisedConcept: InsertConcept = {
      slug: "semi-supervised-learning",
      title: "Semi-Supervised Learning",
      description: "Semi-supervised learning addresses the common scenario where labeled data is scarce but unlabeled data is abundant.",
      category: "semi-supervised",
    };
    
    const selfSupervisedConcept: InsertConcept = {
      slug: "self-supervised-learning",
      title: "Self-Supervised Learning",
      description: "Learning from the data itself by creating artificial supervised tasks.",
      category: "self-supervised",
    };
    
    const contrastiveLearningConcept: InsertConcept = {
      slug: "contrastive-learning",
      title: "Contrastive Learning",
      description: "Learning by comparing similar and dissimilar examples.",
      category: "self-supervised",
    };
    
    this.createConcept(semiSupervisedConcept);
    this.createConcept(selfSupervisedConcept);
    this.createConcept(contrastiveLearningConcept);
    
    // Create theory content for Semi-supervised learning
    const semiSupervisedTheory: InsertTheoryContent = {
      conceptId: 1, // Semi-supervised learning ID
      content: `# Introduction to Semi-Supervised Learning

Semi-supervised learning addresses the common scenario where labeled data is scarce but unlabeled data is abundant. It leverages both labeled and unlabeled data to build better models than would be possible using only the labeled data.

Modern semi-supervised learning techniques have achieved remarkable results, sometimes approaching the performance of fully supervised methods while using only a small fraction of labeled examples.

## Key Assumptions in Semi-Supervised Learning

1. **Smoothness Assumption**: Points that are close to each other in the input space are likely to have the same output label.
2. **Cluster Assumption**: The data tends to form discrete clusters, and points in the same cluster are likely to share a label.
3. **Manifold Assumption**: The high-dimensional data lies approximately on a low-dimensional manifold.

# Mathematical Foundations

Semi-supervised learning adds an additional term to the standard supervised learning objective function to incorporate unlabeled data:

$$L = L_{supervised}(X_L, Y_L) + \\lambda \\cdot L_{unsupervised}(X_L \\cup X_U)$$

Where:
- $L$ is the total loss function
- $L_{supervised}$ is the supervised loss on labeled data
- $L_{unsupervised}$ is the unsupervised loss on all data
- $X_L, Y_L$ represent labeled data points and their labels
- $X_U$ represents unlabeled data points
- $\\lambda$ is a hyperparameter that controls the weight of the unsupervised component

## Consistency Regularization

A common approach in modern semi-supervised learning is consistency regularization, which enforces that the model predictions should be consistent when the input is perturbed:

$$L_{unsupervised} = \\mathbb{E}_{x \\in X_L \\cup X_U} \\mathbb{E}_{\\eta, \\eta'} \\left[ d\\left( f(x, \\eta), f(x, \\eta') \\right) \\right]$$

Where $f(x, \\eta)$ represents the model's prediction on input $x$ with perturbation $\\eta$, and $d(\\cdot, \\cdot)$ is a distance function like mean squared error or KL divergence.

# Modern Semi-Supervised Techniques

## Pseudo-Labeling

Pseudo-labeling involves using the model's predictions on unlabeled data as if they were true labels. The approach follows these steps:

1. Train the model on labeled data
2. Use the model to predict labels for unlabeled data
3. Select high-confidence predictions as "pseudo-labels"
4. Retrain the model using both original labeled data and pseudo-labeled data

## Consistency Regularization Methods

### Π-Model

Enforces consistency between two different stochastic passes of the same input through the network:

$$L_{\\pi} = \\sum_{x \\in X_L \\cup X_U} ||f(x, \\eta_1) - f(x, \\eta_2)||^2$$

### Mean Teacher

Uses a teacher model (exponential moving average of student model parameters) to provide more stable targets:

$$L_{MT} = \\sum_{x \\in X_L \\cup X_U} ||f_{\\theta}(x, \\eta) - f_{\\theta'}(x, \\eta')||^2$$

Where $\\theta'$ is the exponential moving average of $\\theta$.

### FixMatch

Combines pseudo-labeling with consistency regularization by using weak augmentations to generate pseudo-labels and strong augmentations for consistency training:

$$L_{FM} = \\sum_{x \\in X_U} \\mathbf{1}(\\max(p_m) \\geq \\tau) \\cdot H(\\hat{q}, p_s)$$

Where $p_m$ is the prediction on weakly augmented input, $p_s$ is the prediction on strongly augmented input, $\\hat{q}$ is the one-hot pseudo-label, and $\\tau$ is a confidence threshold.`,
      references: "Oliver, A., Odena, A., Raffel, C., Cubuk, E. D., & Goodfellow, I. J. (2018). Realistic Evaluation of Deep Semi-Supervised Learning Algorithms. NeurIPS."
    };
    
    this.createTheoryContent(semiSupervisedTheory);
    
    // Create theory content for Self-supervised learning
    const selfSupervisedTheory: InsertTheoryContent = {
      conceptId: 2, // Self-supervised learning ID
      content: `# Self-Supervised Learning

Self-supervised learning is a paradigm where the data provides the supervision signal for training a model. The core idea is to create a pretext task (or auxiliary task) from unlabeled data to generate pseudo-labels that can be used for supervised learning.

## Core Principles

Self-supervised learning typically involves:

1. **Pretext Tasks**: Design tasks where the inputs and labels can be derived from the data itself
2. **Representation Learning**: The goal is to learn useful feature representations rather than solve the pretext task perfectly
3. **Transfer Learning**: Apply the learned representations to downstream tasks

## Mathematical Formulation

In self-supervised learning, we typically have:

$$\\min_{\\theta} \\mathcal{L}(f_{\\theta}(\\mathcal{T}(x)), g(x))$$

Where:
- $\\mathcal{T}$ is a transformation applied to input $x$
- $g$ is a function that generates pseudo-labels from $x$
- $f_{\\theta}$ is the model with parameters $\\theta$
- $\\mathcal{L}$ is a loss function

# Key Self-Supervised Techniques

## Image Domain

### Colorization
Learning to colorize grayscale images requires understanding of semantics and object recognition.

### Jigsaw Puzzles
Shuffling image patches and training a model to predict their correct positions.

### Rotation Prediction
Rotating images by 0°, 90°, 180°, or 270° and training a model to predict the rotation angle.

## Language Domain

### Masked Language Modeling (BERT)
Masking random tokens in a text sequence and training a model to predict the masked tokens.

### Next Sentence Prediction
Training a model to predict whether two sentences follow each other in a document.

# Advanced Methods

## Contrastive Learning

Modern self-supervised learning methods often use contrastive learning, which involves:

1. Creating positive pairs (similar examples) and negative pairs (dissimilar examples)
2. Training a model to bring positive pairs closer and push negative pairs apart in the representation space

Examples include:
- SimCLR
- MoCo
- CLIP

## Non-Contrastive Methods

Some methods avoid explicit negative pairs:

### BYOL (Bootstrap Your Own Latent)
Uses two networks, an online network and a target network, where the online network is trained to predict the target network's representation.

### SimSiam
Simplifies BYOL by removing the momentum encoder and showing that stop-gradient is sufficient to prevent collapse.`,
      references: "Chen, T., Kornblith, S., Norouzi, M., & Hinton, G. (2020). A simple framework for contrastive learning of visual representations. ICML."
    };
    
    this.createTheoryContent(selfSupervisedTheory);
    
    // Add code implementations
    const pythonImpl: InsertCodeImplementation = {
      conceptId: 1, // Semi-supervised learning
      title: "FixMatch Implementation",
      language: "python",
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
import torchvision.transforms as transforms

class FixMatch(nn.Module):
    def __init__(self, model, threshold=0.95, lambda_u=1.0):
        super().__init__()
        self.model = model
        self.threshold = threshold
        self.lambda_u = lambda_u
        
    def forward(self, x_labeled, y_labeled, x_unlabeled_weak, x_unlabeled_strong):
        batch_size = x_labeled.shape[0]
        
        # Forward pass for labeled data
        logits_labeled = self.model(x_labeled)
        loss_supervised = F.cross_entropy(logits_labeled, y_labeled)
        
        # Generate pseudo-labels using weakly augmented unlabeled data
        with torch.no_grad():
            logits_unlabeled_weak = self.model(x_unlabeled_weak)
            pseudo_probs = F.softmax(logits_unlabeled_weak, dim=1)
            max_probs, pseudo_labels = torch.max(pseudo_probs, dim=1)
            mask = max_probs.ge(self.threshold).float()
        
        # Forward pass for strongly augmented unlabeled data
        logits_unlabeled_strong = self.model(x_unlabeled_strong)
        loss_unsupervised = (F.cross_entropy(
            logits_unlabeled_strong, 
            pseudo_labels, 
            reduction='none'
        ) * mask).mean()
        
        # Combined loss
        loss = loss_supervised + self.lambda_u * loss_unsupervised
        
        return loss, loss_supervised, loss_unsupervised

# Usage example
def train(labeled_loader, unlabeled_loader, model, optimizer, fixmatch, device):
    model.train()
    
    for (x_l, y_l), (x_u_weak, x_u_strong) in zip(labeled_loader, unlabeled_loader):
        x_l, y_l = x_l.to(device), y_l.to(device)
        x_u_weak, x_u_strong = x_u_weak.to(device), x_u_strong.to(device)
        
        optimizer.zero_grad()
        
        loss, loss_s, loss_u = fixmatch(x_l, y_l, x_u_weak, x_u_strong)
        loss.backward()
        optimizer.step()
        
        # Print metrics, update learning rate scheduler, etc.
`,
      description: "This is a PyTorch implementation of FixMatch, a state-of-the-art semi-supervised learning algorithm that combines consistency regularization with pseudo-labeling. The implementation includes the main training loop and loss function."
    };
    
    const cppImpl: InsertCodeImplementation = {
      conceptId: 1, // Semi-supervised learning
      title: "Mean Teacher in C++",
      language: "cpp",
      code: `#include <torch/torch.h>
#include <iostream>
#include <vector>

// Mean Teacher model for semi-supervised learning
class MeanTeacher {
private:
    torch::nn::Module& student_model;
    torch::nn::Module& teacher_model;
    double ema_decay;

public:
    MeanTeacher(torch::nn::Module& student, torch::nn::Module& teacher, double decay = 0.999)
        : student_model(student), teacher_model(teacher), ema_decay(decay) {
        // Copy initial weights from student to teacher
        update_teacher_model(1.0);
    }

    // Update teacher model weights using exponential moving average
    void update_teacher_model(double alpha = -1) {
        double current_decay = (alpha < 0) ? ema_decay : alpha;
        
        auto student_params = student_model.named_parameters();
        auto teacher_params = teacher_model.named_parameters();
        
        for (const auto& student_param : student_params) {
            for (auto& teacher_param : teacher_params) {
                if (student_param.key() == teacher_param.key()) {
                    auto teacher_data = teacher_param.value().data();
                    auto student_data = student_param.value().data();
                    teacher_data.mul_(current_decay).add_(student_data, 1 - current_decay);
                }
            }
        }
    }

    // Compute consistency loss between student and teacher predictions
    torch::Tensor consistency_loss(const torch::Tensor& student_output, 
                                  const torch::Tensor& teacher_output,
                                  const torch::Tensor& mask = {}) {
        torch::Tensor loss;
        
        // MSE loss between student and teacher outputs
        loss = torch::mse_loss(student_output, teacher_output, torch::Reduction::None);
        
        // Apply mask if provided (for example, to ignore certain examples)
        if (mask.defined() && mask.numel() > 0) {
            loss = loss * mask;
        }
        
        return loss.mean();
    }
    
    // Forward pass with both student and teacher models
    std::pair<torch::Tensor, torch::Tensor> forward(const torch::Tensor& x, bool training = true) {
        // Student forward pass
        torch::Tensor student_output = student_model->forward({x}).toTensor();
        
        // Teacher forward pass (no gradient)
        torch::NoGradGuard no_grad;
        torch::Tensor teacher_output = teacher_model->forward({x}).toTensor();
        
        return {student_output, teacher_output};
    }
};

// Example usage
int main() {
    // Define models, optimizer, data loaders, etc.
    // ...
    
    // Create student and teacher models with the same architecture
    auto student = std::make_shared<YourModel>();
    auto teacher = std::make_shared<YourModel>();
    
    // Initialize Mean Teacher
    MeanTeacher mean_teacher(*student, *teacher);
    
    // Training loop
    for (int epoch = 0; epoch < num_epochs; ++epoch) {
        for (auto& batch : data_loader) {
            auto inputs = batch.data;
            auto targets = batch.target;
            
            // Apply different augmentations for student and teacher
            auto student_inputs = apply_augmentation(inputs, strong=true);
            auto teacher_inputs = apply_augmentation(inputs, strong=false);
            
            // Forward pass
            auto [student_output, teacher_output] = mean_teacher.forward(inputs);
            
            // Calculate supervised loss (e.g., cross entropy)
            auto supervised_loss = torch::cross_entropy_loss(student_output, targets);
            
            // Calculate consistency loss
            auto consistency_loss = mean_teacher.consistency_loss(student_output, teacher_output);
            
            // Combined loss
            auto total_loss = supervised_loss + consistency_weight * consistency_loss;
            
            // Backward and optimize
            optimizer.zero_grad();
            total_loss.backward();
            optimizer.step();
            
            // Update teacher model
            mean_teacher.update_teacher_model();
        }
    }
    
    return 0;
}`,
      description: "This C++ implementation of Mean Teacher uses PyTorch C++ API. Mean Teacher is a semi-supervised learning method that uses an exponential moving average of model weights to create a teacher model that provides consistent targets."
    };
    
    this.createCodeImplementation(pythonImpl);
    this.createCodeImplementation(cppImpl);
    
    // Add experiments
    const fixmatchExp: InsertExperiment = {
      conceptId: 1, // Semi-supervised learning
      title: "FixMatch on CIFAR-10",
      description: "Evaluation of FixMatch algorithm on CIFAR-10 with varying amounts of labeled data.",
      setup: `# Experimental Setup

- **Dataset**: CIFAR-10
- **Labeled Data**: 4000 examples (8% of training data)
- **Model Architecture**: WideResNet-28-2
- **Batch Size**: 64 labeled, 448 unlabeled
- **Optimization**: SGD with momentum
- **Learning Rate**: 0.03 with cosine decay
- **Threshold**: 0.95
- **Strong Augmentation**: RandAugment
- **Weak Augmentation**: Random horizontal flip and crop`,
      results: {
        "accuracy": 94.93,
        "error_rate": 5.07,
        "comparison": {
          "supervised_only": 83.32,
          "pseudo_label": 85.22,
          "mean_teacher": 89.64,
          "uda": 91.18,
          "fixmatch": 94.93
        }
      },
      metrics: {
        "epochs": [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
        "train_loss": [2.3, 1.8, 1.4, 1.1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35],
        "val_loss": [2.2, 1.7, 1.3, 1.0, 0.85, 0.75, 0.65, 0.6, 0.55, 0.5, 0.45],
        "train_accuracy": [45, 56, 67, 75, 80, 84, 87, 90, 92, 93, 94],
        "val_accuracy": [44, 55, 65, 73, 78, 82, 85, 88, 91, 93, 94]
      }
    };
    
    this.createExperiment(fixmatchExp);
    
    // Add research papers
    const fixmatchPaper: InsertPaper = {
      title: "FixMatch: Simplifying Semi-Supervised Learning with Consistency and Confidence",
      authors: "Kihyuk Sohn, David Berthelot, Chun-Liang Li, Zizhao Zhang, Nicholas Carlini, Ekin D. Cubuk, Alex Kurakin, Han Zhang, Colin Raffel",
      year: 2020,
      conference: "NeurIPS",
      link: "https://arxiv.org/abs/2001.07685",
      abstract: "Semi-supervised learning (SSL) provides an effective means to leverage unlabeled data to improve a model's performance. In this paper, we demonstrate the power of a simple combination of two common SSL methods: consistency regularization and pseudo-labeling. Our algorithm, FixMatch, first generates pseudo-labels using the model's predictions on weakly-augmented unlabeled images. For a given image, the pseudo-label is only retained if the model produces a high-confidence prediction. The model is then trained to predict this pseudo-label when fed a strongly-augmented version of the same image. Despite its simplicity, we show that FixMatch achieves state-of-the-art performance across a variety of standard semi-supervised learning benchmarks, including 94.93% accuracy on CIFAR-10 with 250 labels and 88.61% accuracy with 40 -- just 4 labels per class. We carry out an extensive ablation study to tease apart the various aspects of FixMatch that lead to its success.",
      key_points: `
- Combines pseudo-labeling with consistency regularization
- Uses weak augmentation for generating pseudo-labels
- Uses strong augmentation for consistency regularization
- Only retains high-confidence predictions as pseudo-labels
- Simple yet effective approach that outperforms previous methods
- Works well even with very few labeled examples
      `,
      concepts: ["semi-supervised-learning", "consistency-regularization", "pseudo-labeling"]
    };
    
    const byolPaper: InsertPaper = {
      title: "Bootstrap Your Own Latent: A New Approach to Self-Supervised Learning",
      authors: "Jean-Bastien Grill, Florian Strub, Florent Altché, Corentin Tallec, Pierre H. Richemond, Elena Buchatskaya, Carl Doersch, Bernardo Avila Pires, Zhaohan Daniel Guo, Mohammad Gheshlaghi Azar, Bilal Piot, Koray Kavukcuoglu, Rémi Munos, Michal Valko",
      year: 2020,
      conference: "NeurIPS",
      link: "https://arxiv.org/abs/2006.07733",
      abstract: "We introduce Bootstrap Your Own Latent (BYOL), a new approach to self-supervised image representation learning. BYOL relies on two neural networks, referred to as online and target networks, that interact and learn from each other. From an augmented view of an image, we train the online network to predict the target network representation of the same image under a different augmented view. At the same time, we update the target network with a slow-moving average of the online network. While previous methods based on contrastive learning explicitly push representations of distinct images apart, BYOL achieves similar performance without using negative pairs. We demonstrate that BYOL achieves state-of-the-art results on ImageNet and in robustness tests.",
      key_points: `
- Self-supervised learning method that doesn't rely on negative pairs
- Uses two networks: online and target networks
- Online network predicts target network's representation of the same image
- Target network is updated with an exponential moving average of the online network
- Achieves state-of-the-art performance without relying on contrastive learning
      `,
      concepts: ["self-supervised-learning", "representation-learning"]
    };
    
    const simclrPaper: InsertPaper = {
      title: "A Simple Framework for Contrastive Learning of Visual Representations",
      authors: "Ting Chen, Simon Kornblith, Mohammad Norouzi, Geoffrey Hinton",
      year: 2020,
      conference: "ICML",
      link: "https://arxiv.org/abs/2002.05709",
      abstract: "This paper presents SimCLR: a simple framework for contrastive learning of visual representations. We simplify recently proposed contrastive self-supervised learning algorithms without requiring specialized architectures or a memory bank. In order to understand what enables the contrastive prediction tasks to learn useful representations, we systematically study the major components of our framework. We show that (1) composition of data augmentations plays a critical role in defining effective predictive tasks, (2) introducing a learnable nonlinear transformation between the representation and the contrastive loss substantially improves the quality of the learned representations, and (3) contrastive learning benefits from larger batch sizes and more training steps compared to supervised learning. By combining these findings, we are able to considerably outperform previous methods for self-supervised and semi-supervised learning on ImageNet. A linear classifier trained on self-supervised representations learned by SimCLR achieves 76.5% top-1 accuracy, which is a 7% absolute improvement over previous state-of-the-art, matching the performance of a supervised ResNet-50.",
      key_points: `
- A simple contrastive learning framework without specialized architectures or memory banks
- Highlights the importance of data augmentation in contrastive learning
- Introduces a projection head between representation and contrastive loss
- Benefits from larger batch sizes for more negative examples
- Outperforms previous self-supervised methods by a significant margin
      `,
      concepts: ["self-supervised-learning", "contrastive-learning"]
    };
    
    this.createPaper(fixmatchPaper);
    this.createPaper(byolPaper);
    this.createPaper(simclrPaper);
  }
}

export const storage = new MemStorage();

import { apiRequest } from "@/lib/queryClient";

// API Endpoints for concepts
export async function getAllConcepts() {
  const response = await fetch("/api/concepts");
  if (!response.ok) {
    throw new Error(`Failed to fetch concepts: ${response.statusText}`);
  }
  return response.json();
}

export async function getConceptsByCategory(category: string) {
  const response = await fetch(`/api/concepts/category/${category}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch concepts by category: ${response.statusText}`);
  }
  return response.json();
}

export async function getConceptBySlug(slug: string) {
  const response = await fetch(`/api/concepts/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch concept: ${response.statusText}`);
  }
  return response.json();
}

export async function createConcept(conceptData: any) {
  return apiRequest("POST", "/api/concepts", conceptData);
}

// API Endpoints for theory content
export async function getTheoryContent(conceptId: number) {
  const response = await fetch(`/api/theory/${conceptId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch theory content: ${response.statusText}`);
  }
  return response.json();
}

export async function createTheoryContent(theoryData: any) {
  return apiRequest("POST", "/api/theory", theoryData);
}

// API Endpoints for code implementations
export async function getCodeImplementations(conceptId: number) {
  const response = await fetch(`/api/code/${conceptId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch code implementations: ${response.statusText}`);
  }
  return response.json();
}

export async function createCodeImplementation(codeData: any) {
  return apiRequest("POST", "/api/code", codeData);
}

// API Endpoints for experiments
export async function getExperiments(conceptId: number) {
  const response = await fetch(`/api/experiments/${conceptId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch experiments: ${response.statusText}`);
  }
  return response.json();
}

export async function createExperiment(experimentData: any) {
  return apiRequest("POST", "/api/experiments", experimentData);
}

// API Endpoints for papers
export async function getAllPapers() {
  const response = await fetch("/api/papers");
  if (!response.ok) {
    throw new Error(`Failed to fetch papers: ${response.statusText}`);
  }
  return response.json();
}

export async function getPaperById(id: number) {
  const response = await fetch(`/api/papers/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch paper: ${response.statusText}`);
  }
  return response.json();
}

export async function createPaper(paperData: any) {
  return apiRequest("POST", "/api/papers", paperData);
}

import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { _sortByOrder } from 'src/app/helpers/functions'
import { ApiResponse, Document, Annotation, Term } from 'src/app/models/interfaces'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = environment.apiUrl

  constructor(
    private http: HttpClient,
  ) { }

  getTerms(): Observable<Term[]> {
    return this.http.get<Term[]>(`${this.url}/term?multiple=true`)
  }

  addDocuments(documents: Document[]): Observable<ApiResponse> {
    return this.http.request<ApiResponse>('post', `${this.url}/document`, { body: documents })
  }

  addTerms(terms: Term[]): Observable<ApiResponse> {
    return this.http.request<ApiResponse>('post', `${this.url}/term`, { body: terms })
  }

  deleteDocuments(documents: Document[]): Observable<ApiResponse> {
    return this.http.request<ApiResponse>('delete', `${this.url}/document`, { body: documents })
  }

  getAssignedDocs(query: any): Observable<any[]> {
    const { userEmail, pageSize, pageIndex } = query
    return this.http.get<any[]>(`${this.url}/docs/${userEmail}?page_size=${pageSize}&page_index=${pageIndex}`)
  }

  addAnnotation(annotation: Annotation): Observable<any> {
    return this.http.post<any>(`${this.url}/annotation`, annotation)
  }

  removeAnnotation(annotation: Annotation): Observable<any> {
    return this.http.request<any>('delete', `${this.url}/annotation`, { body: [annotation] })
  }

  markAsCompleted(docToMark: any): Observable<Document> {
    return this.http.post<Document>(`${this.url}/mark-doc-as/completed`, docToMark)
  }

  markAsUncompleted(docToMark: any): Observable<Document> {
    return this.http.post<Document>(`${this.url}/mark-doc-as/uncompleted`, docToMark)
  }

  markAsValidated(docToMark: any): Observable<Document> {
    return this.http.post<Document>(`${this.url}/mark-doc-as/validated`, docToMark)
  }

  markAsUnvalidated(dockToMark: any): Observable<Document> {
    return this.http.post<Document>(`${this.url}/mark-doc-as/unvalidated`, dockToMark)
  }

  getSuggestions(docToCheck: any): Observable<any> {
    return this.http.post<any>(`${this.url}/suggestions`, docToCheck)
  }

  saveValidatedAnnotations(validatedAnnotations: any[]): Observable<any> {
    return this.http.post<any>(`${this.url}/annotations_validated/add`, validatedAnnotations)
  }

  getValidatedDecsCodes(validatedAnnotations: any): Observable<any> {
    return this.http.post<any>(`${this.url}/annotations_validated/get`, validatedAnnotations)
  }

  getDoc(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.url}/doc/${id}`)
  }

}

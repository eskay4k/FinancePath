import { describe,it,expect } from 'vitest';
import { accountCacheKey,readAccountCache,mergeLearningProgress } from './cloud-progress';
import { freshProgress,completeLesson } from './progress';
import { lessons } from './data/lessons';
import { validAccountConfig } from './auth-config';
describe('account boundaries',()=>{
 it('does not read another account cache or guest storage',()=>{
  const records=new Map([[accountCacheKey('alice'),JSON.stringify({name:'Alice',progress:freshProgress()})],['financepath.progress.v1',JSON.stringify(freshProgress())]]);
  const storage={getItem:(key:string)=>records.get(key)??null};
  expect(readAccountCache(storage,'bob')).toBeNull();
  expect(readAccountCache(storage,'alice')?.name).toBe('Alice');
 });
 it('rejects privileged keys and non-provider URLs',()=>{
  expect(validAccountConfig('https://example.com','sb_publishable_test')).toBe(false);
  expect(validAccountConfig('https://test.supabase.co','sb_secret_test')).toBe(false);
  const privileged='x.'+btoa(JSON.stringify({role:'service_role'}))+'.x';
  expect(validAccountConfig('https://test.supabase.co',privileged)).toBe(false);
  expect(validAccountConfig('https://test.supabase.co','sb_publishable_test')).toBe(true);
 });
 it('normalizes damaged cached data',()=>{
  const storage={getItem:()=>JSON.stringify({name:' Learner ',progress:{version:999,completedLessons:{fake:'today'}}})};
  expect(readAccountCache(storage,'one')).toEqual({name:'Learner',progress:freshProgress()});
 });
});
describe('deliberate progress import',()=>{
 it('combines completions without inflating counts and preserves account level',()=>{
  const base=completeLesson({...freshProgress(),selectedLevel:'Advanced'},lessons[0].id,'2026-10-01T12:00:00Z');
  const guest=completeLesson(completeLesson({...freshProgress(),selectedLevel:'Beginner'},lessons[0].id,'2026-10-02T12:00:00Z'),lessons[1].id,'2026-10-03T12:00:00Z');
  const merged=mergeLearningProgress(base,guest);
  expect(merged.selectedLevel).toBe('Advanced');
  expect(Object.keys(merged.completedLessons)).toHaveLength(2);
  expect(merged.completedLessons[lessons[0].id]).toBe('2026-10-01T12:00:00Z');
  expect(mergeLearningProgress(merged,guest)).toEqual(merged);
 });
});
